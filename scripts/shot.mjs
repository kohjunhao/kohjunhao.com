// Screenshot pages with the installed Chrome, headless, over the DevTools Protocol.
// usage: node shot.mjs jobs.json
// jobs.json: [{ "url": "...", "out": "x.png", "w": 1440, "h": 900, "full": false,
//               "mobile": false, "dark": false, "wait": 1200, "dsf": 1, "eval": "js" }]
// "eval" runs in the page before the screenshot; whatever it returns is printed.
import { spawn } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync, rmSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const MAX_FULL_HEIGHT = 12000;

const jobs = JSON.parse(readFileSync(process.argv[2], "utf8"));
const port = 9300 + Math.floor(Math.random() * 500);
const profile = mkdtempSync(join(tmpdir(), "shot-"));
const chrome = spawn(
  CHROME,
  [
    "--headless=new",
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profile}`,
    "--no-first-run",
    "--no-default-browser-check",
    "--hide-scrollbars",
    "about:blank",
  ],
  { stdio: "ignore" },
);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function waitForChrome() {
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (res.ok) {
        return;
      }
    } catch {}
    await sleep(150);
  }
  throw new Error("chrome did not start");
}

function connect(wsUrl) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl);
    let nextId = 1;
    const pending = new Map();
    const listeners = new Map();

    ws.onopen = () =>
      resolve({
        send(method, params = {}) {
          const id = nextId++;
          ws.send(JSON.stringify({ id, method, params }));
          return new Promise((res, rej) => pending.set(id, { res, rej }));
        },
        once(event, timeoutMs) {
          return new Promise((res) => {
            const timer = setTimeout(() => res(null), timeoutMs);
            listeners.set(event, (p) => {
              clearTimeout(timer);
              listeners.delete(event);
              res(p);
            });
          });
        },
        close() {
          ws.close();
        },
      });
    ws.onerror = (e) => reject(new Error("ws error " + (e.message || "")));
    ws.onmessage = (m) => {
      const msg = JSON.parse(m.data);
      if (msg.id && pending.has(msg.id)) {
        const { res, rej } = pending.get(msg.id);
        pending.delete(msg.id);
        if (msg.error) {
          rej(new Error(msg.error.message));
        } else {
          res(msg.result);
        }
        return;
      }
      if (msg.method && listeners.has(msg.method)) {
        listeners.get(msg.method)(msg.params);
      }
    };
  });
}

async function shoot(job) {
  const target = await (
    await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: "PUT" })
  ).json();
  const cdp = await connect(target.webSocketDebuggerUrl);
  const w = job.w ?? 1440;
  const h = job.h ?? 900;

  await cdp.send("Page.enable");
  await cdp.send("Emulation.setDeviceMetricsOverride", {
    width: w,
    height: h,
    deviceScaleFactor: job.dsf ?? 1,
    mobile: Boolean(job.mobile),
  });
  await cdp.send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-color-scheme", value: job.dark ? "dark" : "light" }],
  });

  const loaded = cdp.once("Page.loadEventFired", job.timeout ?? 25000);
  await cdp.send("Page.navigate", { url: job.url });
  await loaded;
  await sleep(job.wait ?? 1200);

  if (job.eval) {
    const { result } = await cdp.send("Runtime.evaluate", {
      expression: job.eval,
      awaitPromise: true,
      returnByValue: true,
    });
    if (result?.value !== undefined) {
      console.log("eval", JSON.stringify(result.value));
    }
    await sleep(job.evalWait ?? 600);
  }

  const params = { format: "png" };
  if (job.full) {
    const { cssContentSize } = await cdp.send("Page.getLayoutMetrics");
    params.captureBeyondViewport = true;
    params.clip = {
      x: 0,
      y: 0,
      width: w,
      height: Math.min(Math.ceil(cssContentSize.height), job.maxH ?? MAX_FULL_HEIGHT),
      scale: 1,
    };
  }
  const { data } = await cdp.send("Page.captureScreenshot", params);
  mkdirSync(dirname(job.out), { recursive: true });
  writeFileSync(job.out, Buffer.from(data, "base64"));
  cdp.close();
  await fetch(`http://127.0.0.1:${port}/json/close/${target.id}`).catch(() => {});
  console.log("ok", job.out);
}

try {
  await waitForChrome();
  for (const job of jobs) {
    try {
      await shoot(job);
    } catch (err) {
      console.log("FAIL", job.url, err.message);
    }
  }
} finally {
  chrome.kill("SIGKILL");
  await sleep(300);
  rmSync(profile, { recursive: true, force: true });
}
