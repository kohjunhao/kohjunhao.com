"use client";

import { useEffect, useRef, useState } from "react";

type Phase = "spinning" | "perturbed" | "fallen";

type PhysState = {
  phase: Phase;
  spin: number;
  lean: number;
  leanDir: number;
  spinRate: number;
  leanRate: number;
  precessRate: number;
};

const BASE_SPIN_RATE = 4.2;

function createState(): PhysState {
  return {
    phase: "spinning",
    spin: 0,
    lean: 0,
    leanDir: 0,
    spinRate: BASE_SPIN_RATE,
    leanRate: 0,
    precessRate: 0,
  };
}

/**
 * Hand-authored ASCII spinning top. Math-driven silhouette projection.
 *
 * Interaction model: **deliberate drag**. A hover or single click does
 * nothing — reality holds. Press, drag ≥ 14px, and release to perturb
 * the top with a force proportional to how far you dragged. Once fallen,
 * click to reset.
 */
export function Totem({
  cols = 30,
  rows = 24,
  charset = " ·:-=+*#█",
  cellW = 10,
  cellH = 12,
  spinOnly = false,
}: {
  cols?: number;
  rows?: number;
  charset?: string;
  cellW?: number;
  cellH?: number;
  spinOnly?: boolean;
}) {
  const canvasRef = useRef<HTMLPreElement>(null);
  const stateRef = useRef<PhysState>(createState());
  const dragRef = useRef({ down: false, startX: 0, startY: 0, moved: 0 });
  const [phase, setPhase] = useState<Phase>("spinning");

  useEffect(() => {
    let raf = 0;
    let disposed = false;
    const node: HTMLPreElement | null = canvasRef.current;
    if (!node) return;
    let last = performance.now();

    function profile(h: number) {
      if (h < -1 || h > 1) return 0;
      if (h < -0.55) return 0.05 + ((h + 1) / 0.45) * 0.35;
      if (h < -0.1) return 0.4 + ((h + 0.55) / 0.45) * 0.25;
      if (h < 0.05) return 0.65;
      if (h < 0.15) return 0.55;
      if (h < 0.7) return 0.08;
      if (h < 0.95) return 0.15;
      return 0;
    }

    function render(leanAngle: number, azimuth: number, spin: number) {
      const grid: string[][] = new Array(rows);
      const depth: number[][] = new Array(rows);
      for (let r = 0; r < rows; r++) {
        grid[r] = new Array(cols).fill(" ");
        depth[r] = new Array(cols).fill(-Infinity);
      }

      const cosL = Math.cos(leanAngle);
      const sinL = Math.sin(leanAngle);
      const cosA = Math.cos(azimuth);
      const sinA = Math.sin(azimuth);

      const centerX = cols / 2;
      const centerY = rows / 2 + 1.5;
      const scale = Math.min(cols, rows) * 0.38;

      const samples = 3400;
      for (let i = 0; i < samples; i++) {
        const h = -1 + (2 * i) / samples;
        const theta = (i * 2.399) % (Math.PI * 2);
        const rr = profile(h);
        if (rr === 0) continue;

        const lx = rr * Math.cos(theta + spin);
        const ly = h;
        const lz = rr * Math.sin(theta + spin);

        const x1 = lx * cosA + lz * sinA;
        const y1 = ly;
        const z1 = -lx * sinA + lz * cosA;
        const x2 = x1;
        const y2 = y1 * cosL - z1 * sinL;
        const z2 = y1 * sinL + z1 * cosL;
        const x3 = x2 * cosA - z2 * sinA;
        let y3 = y2;
        const z3 = x2 * sinA + z2 * cosA;

        const tipY = -1 * cosL;
        y3 += -(tipY + 1);

        const sx = centerX + x3 * scale;
        const sy = centerY - y3 * scale;
        const d = z3;

        const gx = Math.round(sx);
        const gy = Math.round(sy);
        if (gx < 0 || gx >= cols || gy < 0 || gy >= rows) continue;
        if (d <= depth[gy][gx]) continue;
        depth[gy][gx] = d;

        const nx = Math.cos(theta + spin);
        const ny = 0;
        const nz = Math.sin(theta + spin);
        const n1x = nx * cosA + nz * sinA;
        const n1y = ny;
        const n1z = -nx * sinA + nz * cosA;
        const n2x = n1x;
        const n2y = n1y * cosL - n1z * sinL;
        const n2z = n1y * sinL + n1z * cosL;
        const n3x = n2x * cosA - n2z * sinA;
        const n3y = n2y;
        const n3z = n2x * sinA + n2z * cosA;

        const lxl = -0.5,
          lyl = 0.6,
          lzl = 0.8;
        const ll = Math.sqrt(lxl * lxl + lyl * lyl + lzl * lzl);
        const lam = (n3x * lxl + n3y * lyl + n3z * lzl) / ll;
        let shade = 0.25 + 0.75 * Math.max(0, lam);
        shade = Math.max(0, Math.min(1, shade));
        const idx = Math.min(
          charset.length - 1,
          Math.round(shade * (charset.length - 1))
        );
        grid[gy][gx] = charset[idx];
      }

      return grid.map((row) => row.join("")).join("\n");
    }

    function step(dt: number) {
      const s = stateRef.current;
      s.spin += s.spinRate * dt;
      if (spinOnly) return;

      if (s.phase === "perturbed") {
        s.lean += s.leanRate * dt;
        s.leanDir += s.precessRate * dt;
        s.leanRate *= Math.pow(0.985, dt * 60);
        s.precessRate *= Math.pow(0.992, dt * 60);
        const critical = 0.45;
        if (s.lean > critical) {
          s.leanRate += (s.lean - critical) * 3.2 * dt;
        } else if (s.lean < 0.02 && Math.abs(s.leanRate) < 0.05) {
          s.lean = 0;
          s.leanRate = 0;
          s.precessRate = 0;
          s.phase = "spinning";
        }
        if (s.lean >= 1.52) {
          s.lean = Math.PI / 2;
          s.leanRate = 0;
          s.precessRate = 0;
          s.spinRate *= 0.05;
          s.phase = "fallen";
        }
        if (s.lean < 0) {
          s.lean = 0;
          s.leanRate = Math.abs(s.leanRate) * 0.3;
        }
      } else if (s.phase === "fallen") {
        s.spinRate *= Math.pow(0.98, dt * 60);
      }
    }

    function loop(t: number) {
      if (disposed || !node) return;
      const dt = Math.min(0.05, (t - last) / 1000);
      last = t;
      step(dt);
      const s = stateRef.current;
      const lean = s.phase === "fallen" ? Math.PI / 2 : s.lean;
      node.textContent = render(lean, s.leanDir, s.spin);
      if (s.phase !== phase) setPhase(s.phase);
      raf = requestAnimationFrame(loop);
    }

    raf = requestAnimationFrame(loop);
    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
    };
  }, [cols, rows, charset, spinOnly, phase]);

  const onDown = (e: React.PointerEvent<HTMLPreElement>) => {
    if (spinOnly) return;
    const s = stateRef.current;
    if (s.phase === "fallen") {
      // click to reset
      s.phase = "spinning";
      s.lean = 0;
      s.leanRate = 0;
      s.precessRate = 0;
      s.spinRate = BASE_SPIN_RATE;
      return;
    }
    dragRef.current = {
      down: true,
      startX: e.clientX,
      startY: e.clientY,
      moved: 0,
    };
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const onMove = (e: React.PointerEvent<HTMLPreElement>) => {
    const d = dragRef.current;
    if (!d.down) return;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    d.moved = Math.max(d.moved, Math.hypot(dx, dy));
  };

  const onUp = (e: React.PointerEvent<HTMLPreElement>) => {
    const d = dragRef.current;
    if (!d.down) return;
    d.down = false;
    if (d.moved < 14) return; // ignore taps / hovers
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    const dir = Math.atan2(dy, dx);
    const strength = Math.min(2.2, d.moved / 60);
    const s = stateRef.current;
    if (s.phase === "fallen") return;
    s.phase = "perturbed";
    s.leanDir = dir;
    s.leanRate += 0.8 * strength;
    s.precessRate = Math.max(s.precessRate, 2.0 + strength * 0.8);
  };

  const width = cols * cellW;
  const height = rows * cellH;

  const caption =
    phase === "spinning"
      ? "push me to check reality"
      : phase === "perturbed"
      ? "totem · wobbling"
      : "reality settled. tap to reset →";

  return (
    <div className="flex flex-col items-center gap-3" style={{ color: "var(--totem)" }}>
      <pre
        ref={canvasRef}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        className="font-mono m-0 p-0 whitespace-pre select-none"
        style={{
          width,
          height,
          fontSize: cellH - 2,
          lineHeight: `${cellH}px`,
          letterSpacing: "0.02em",
          cursor: phase === "fallen" ? "pointer" : "grab",
          touchAction: "none",
        }}
      />
      <div className="mono text-[0.6rem] tracking-[0.22em] uppercase text-muted">
        — {caption}
      </div>
    </div>
  );
}
