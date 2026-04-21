"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

/**
 * A Three.js-rendered icosahedron, passed through an ASCII effect so the
 * scene is drawn in monospaced characters. Signature "wow" element — operator
 * grain, Japanese-calm palette, no color outside Aizome tokens.
 *
 * Dynamically imports three + AsciiEffect so the bundle stays light for users
 * who never hit pages that include this component.
 */
export function AsciiHero({
  size = 240,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !mountRef.current) return;
    const node = mountRef.current;
    let disposed = false;
    let raf = 0;

    (async () => {
      const THREE = await import("three");
      const { AsciiEffect } = await import(
        "three/examples/jsm/effects/AsciiEffect.js"
      );

      if (disposed) return;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
      camera.position.set(0, 0, 3.2);

      const renderer = new THREE.WebGLRenderer({
        antialias: false,
        alpha: true,
      });
      renderer.setSize(size, size);

      const effect = new AsciiEffect(renderer, " ·:-+=*▒▓█", {
        invert: true,
        resolution: 0.17,
        scale: 1,
      });
      effect.setSize(size, size);
      const el = effect.domElement as HTMLDivElement;
      el.style.color = "currentColor";
      el.style.background = "transparent";
      el.style.fontFamily =
        "var(--font-jetbrains-mono), ui-monospace, Menlo, monospace";
      el.style.fontSize = "10px";
      el.style.lineHeight = "8px";
      el.style.letterSpacing = "0";
      el.style.whiteSpace = "pre";
      el.style.userSelect = "none";
      el.style.pointerEvents = "none";
      el.setAttribute("aria-hidden", "true");

      node.appendChild(el);

      const ambient = new THREE.AmbientLight(0xffffff, 0.4);
      scene.add(ambient);
      const keyLight = new THREE.DirectionalLight(0xffffff, 1.1);
      keyLight.position.set(2, 2.5, 3);
      scene.add(keyLight);
      const rimLight = new THREE.DirectionalLight(0xffffff, 0.4);
      rimLight.position.set(-2, -1.5, -2);
      scene.add(rimLight);

      const geo = new THREE.IcosahedronGeometry(1, 1);
      const mat = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        flatShading: true,
        shininess: 6,
      });
      const mesh = new THREE.Mesh(geo, mat);
      scene.add(mesh);

      let targetX = 0;
      let targetY = 0;
      const onPointerMove = (e: PointerEvent) => {
        const rect = node.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / rect.width - 0.5;
        const ny = (e.clientY - rect.top) / rect.height - 0.5;
        targetX = ny * 0.8;
        targetY = nx * 0.8;
      };
      const onPointerLeave = () => {
        targetX = 0;
        targetY = 0;
      };
      node.addEventListener("pointermove", onPointerMove);
      node.addEventListener("pointerleave", onPointerLeave);

      const start = performance.now();
      const animate = (t: number) => {
        if (disposed) return;
        const elapsed = (t - start) / 1000;

        // autonomous base rotation, slow — reads as "breathing"
        const baseY = reduce ? 0 : elapsed * 0.25;
        const baseX = reduce ? 0 : Math.sin(elapsed * 0.4) * 0.18;

        mesh.rotation.x += (baseX + targetX - mesh.rotation.x) * 0.06;
        mesh.rotation.y += (baseY + targetY - mesh.rotation.y) * 0.06;

        effect.render(scene, camera);
        raf = requestAnimationFrame(animate);
      };
      raf = requestAnimationFrame(animate);

      return () => {
        node.removeEventListener("pointermove", onPointerMove);
        node.removeEventListener("pointerleave", onPointerLeave);
        geo.dispose();
        mat.dispose();
        renderer.dispose();
        if (node.contains(el)) node.removeChild(el);
      };
    })();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
    };
  }, [mounted, size, reduce]);

  return (
    <div
      ref={mountRef}
      aria-hidden
      className={`relative text-accent ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
