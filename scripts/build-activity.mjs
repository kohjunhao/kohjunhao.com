// Counts two things per day and writes src/data/activity.json:
// my commits across every local repo, and the prompts I typed at a coding agent.
// Only dates and counts leave this machine: no repo names, no messages, no prompt text.
// usage: node scripts/build-activity.mjs
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const HOME = homedir();
const REPO_PARENTS = [join(HOME, "code")];
const EXTRA_REPOS = [join(HOME, "Documents", "FULLMARKS")];
// My commit emails stay out of this public repo: one per line in a gitignored file.
const MY_EMAILS_FILE = new URL("../data/raw/my-emails.txt", import.meta.url);
const PROMPT_HISTORY = join(HOME, ".claude", "history.jsonl");
const OUT = new URL("../src/data/activity.json", import.meta.url);

function findRepos() {
  const repos = [...EXTRA_REPOS];
  for (const parent of REPO_PARENTS) {
    for (const name of readdirSync(parent)) {
      repos.push(join(parent, name));
    }
  }
  return repos.filter((dir) => existsSync(join(dir, ".git")));
}

function commitsOf(repo) {
  let out = "";
  try {
    out = execFileSync(
      "git",
      ["-C", repo, "log", "--all", "--no-merges", "--format=%H|%ae|%ad", "--date=short"],
      { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 },
    );
  } catch {
    return [];
  }
  return out
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const [hash, email, day] = line.split("|");
      return { hash, email, day };
    });
}

function localDay(timestampMs) {
  const d = new Date(timestampMs);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const date = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${date}`;
}

function promptsPerDay() {
  const perDay = {};
  if (!existsSync(PROMPT_HISTORY)) {
    return perDay;
  }
  for (const line of readFileSync(PROMPT_HISTORY, "utf8").split("\n")) {
    if (!line) {
      continue;
    }
    let timestamp;
    try {
      timestamp = JSON.parse(line).timestamp;
    } catch {
      continue;
    }
    if (typeof timestamp !== "number") {
      continue;
    }
    const day = localDay(timestamp);
    perDay[day] = (perDay[day] ?? 0) + 1;
  }
  return perDay;
}

function myEmails() {
  if (!existsSync(MY_EMAILS_FILE)) {
    throw new Error("data/raw/my-emails.txt is missing: list your commit emails there, one per line");
  }
  return new Set(readFileSync(MY_EMAILS_FILE, "utf8").split("\n").map((l) => l.trim()).filter(Boolean));
}

const MY_EMAILS = myEmails();
const repos = findRepos();
const seen = new Set();
const commits = {};
let reposWithMyCommits = 0;

for (const repo of repos) {
  let mine = 0;
  for (const { hash, email, day } of commitsOf(repo)) {
    if (!MY_EMAILS.has(email) || seen.has(hash)) {
      continue;
    }
    seen.add(hash);
    commits[day] = (commits[day] ?? 0) + 1;
    mine++;
  }
  if (mine > 0) {
    reposWithMyCommits++;
  }
}

const prompts = promptsPerDay();
const sum = (perDay) => Object.values(perDay).reduce((a, b) => a + b, 0);
const allDays = [...new Set([...Object.keys(commits), ...Object.keys(prompts)])].sort();

// days: { "2026-08-12": [commits, prompts] }
const activity = {
  from: allDays[0],
  through: allDays.at(-1),
  commits: sum(commits),
  prompts: sum(prompts),
  repos: reposWithMyCommits,
  days: Object.fromEntries(allDays.map((d) => [d, [commits[d] ?? 0, prompts[d] ?? 0]])),
};

writeFileSync(OUT, JSON.stringify(activity) + "\n");
console.log(
  `${activity.commits} commits across ${activity.repos} repos, ${activity.prompts} prompts, ` +
    `${allDays.length} days with either, ${activity.from} to ${activity.through}`,
);
