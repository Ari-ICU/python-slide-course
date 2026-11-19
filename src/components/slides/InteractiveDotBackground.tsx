"use client";

import React, { useEffect, useRef } from "react";

interface InteractiveDotBackgroundProps {
  accentColor?: string;
}

const DOT_SPACING = 24;
const BASE_RADIUS = 1.35;
const MAX_EXTRA_RADIUS = 1.85;
const PARALLAX_RANGE = 22;
const MAGNET_RADIUS = 210;
const MAGNET_STRENGTH = 0.24;

function parseHexRgb(hex?: string): [number, number, number] {
  if (!hex) return [37, 99, 235];
  const cleaned = hex.replace("#", "").trim();
  if (cleaned.length === 3) {
    const r = parseInt(cleaned[0] + cleaned[0], 16);
    const g = parseInt(cleaned[1] + cleaned[1], 16);
    const b = parseInt(cleaned[2] + cleaned[2], 16);
    if (!Number.isNaN(r) && !Number.isNaN(g) && !Number.isNaN(b)) return [r, g, b];
  } else if (cleaned.length === 6) {
    const r = parseInt(cleaned.slice(0, 2), 16);
    const g = parseInt(cleaned.slice(2, 4), 16);
    const b = parseInt(cleaned.slice(4, 6), 16);
    if (!Number.isNaN(r) && !Number.isNaN(g) && !Number.isNaN(b)) return [r, g, b];
  }
  return [37, 99, 235];
}

function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor;
}

export function InteractiveDotBackground({
  accentColor = "#2563EB",
}: InteractiveDotBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const accentRgbRef = useRef<[number, number, number]>(parseHexRgb(accentColor));
  const wakeUpRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    accentRgbRef.current = parseHexRgb(accentColor);
    wakeUpRef.current?.();
  }, [accentColor]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let isDark = document.documentElement.classList.contains("dark");
    let rafId: number | null = null;

    // Client viewport coordinates of the last pointer event
    let lastClientX = 0;
    let lastClientY = 0;
    let pointerActive = false;

    // Smoothly interpolated coordinates local to the canvas
    let smoothX = 0;
    let smoothY = 0;
    let smoothInfluence = 0;
    let hasInitializedSmooth = false;

    const updateCanvasSize = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (!hasInitializedSmooth && width > 0 && height > 0) {
        smoothX = width / 2;
        smoothY = height / 2;
        hasInitializedSmooth = true;
      }
    };

    const drawFrame = () => {
      rafId = null;
      if (width <= 0 || height <= 0) return;

      const rect = container.getBoundingClientRect();
      const targetX = pointerActive ? lastClientX - rect.left : width / 2;
      const targetY = pointerActive ? lastClientY - rect.top : height / 2;
      const targetInfluence = pointerActive && !reducedMotionQuery.matches ? 1 : 0;

      if (reducedMotionQuery.matches) {
        smoothX = width / 2;
        smoothY = height / 2;
        smoothInfluence = 0;
      } else {
        smoothX = lerp(smoothX, targetX, 0.14);
        smoothY = lerp(smoothY, targetY, 0.14);
        smoothInfluence = lerp(smoothInfluence, targetInfluence, 0.1);
      }

      ctx.clearRect(0, 0, width, height);

      const [accentR, accentG, accentB] = accentRgbRef.current;
      const baseR = isDark ? 226 : 15;
      const baseG = isDark ? 232 : 23;
      const baseB = isDark ? 240 : 42;
      const baseAlpha = isDark ? 0.16 : 0.14;

      // Subtle ambient radial halo centered at the smoothed cursor position
      if (smoothInfluence > 0.02) {
        const halo = ctx.createRadialGradient(
          smoothX,
          smoothY,
          0,
          smoothX,
          smoothY,
          MAGNET_RADIUS * 1.15
        );
        halo.addColorStop(
          0,
          `rgba(${accentR}, ${accentG}, ${accentB}, ${(0.08 * smoothInfluence).toFixed(4)})`
        );
        halo.addColorStop(1, `rgba(${accentR}, ${accentG}, ${accentB}, 0)`);
        ctx.fillStyle = halo;
        ctx.fillRect(0, 0, width, height);
      }

      // Global cursor-following parallax offset (bounded within [-PARALLAX_RANGE, PARALLAX_RANGE])
      const halfW = Math.max(width / 2, 1);
      const halfH = Math.max(height / 2, 1);
      const normX = Math.max(-1, Math.min(1, (smoothX - halfW) / halfW));
      const normY = Math.max(-1, Math.min(1, (smoothY - halfH) / halfH));

      const shiftX = normX * PARALLAX_RANGE * smoothInfluence;
      const shiftY = normY * PARALLAX_RANGE * smoothInfluence;

      const cols = Math.ceil(width / DOT_SPACING) + 2;
      const rows = Math.ceil(height / DOT_SPACING) + 2;

      for (let row = -2; row < rows; row++) {
        const baseY = row * DOT_SPACING + shiftY;
        for (let col = -2; col < cols; col++) {
          const baseX = col * DOT_SPACING + shiftX;

          const dx = smoothX - baseX;
          const dy = smoothY - baseY;
          const distSq = dx * dx + dy * dy;

          if (smoothInfluence > 0.01 && distSq < MAGNET_RADIUS * MAGNET_RADIUS) {
            const dist = Math.sqrt(distSq);
            const t = 1 - dist / MAGNET_RADIUS;
            const ease = t * t * (3 - 2 * t);
            const strength = ease * smoothInfluence;

            const drawX = baseX + dx * MAGNET_STRENGTH * strength;
            const drawY = baseY + dy * MAGNET_STRENGTH * strength;
            const radius = BASE_RADIUS + MAX_EXTRA_RADIUS * strength;

            const r = Math.round(lerp(baseR, accentR, strength));
            const g = Math.round(lerp(baseG, accentG, strength));
            const b = Math.round(lerp(baseB, accentB, strength));
            const alpha = lerp(baseAlpha, isDark ? 0.65 : 0.52, strength);

            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(3)})`;
            ctx.beginPath();
            ctx.arc(drawX, drawY, radius, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.fillStyle = `rgba(${baseR}, ${baseG}, ${baseB}, ${baseAlpha})`;
            ctx.beginPath();
            ctx.arc(baseX, baseY, BASE_RADIUS, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      canvas.dataset.dotsActive = "true";

      const deltaX = Math.abs(targetX - smoothX);
      const deltaY = Math.abs(targetY - smoothY);
      const deltaInf = Math.abs(targetInfluence - smoothInfluence);

      if (!reducedMotionQuery.matches && (deltaX > 0.15 || deltaY > 0.15 || deltaInf > 0.005)) {
        rafId = window.requestAnimationFrame(drawFrame);
      }
    };

    const scheduleFrame = () => {
      if (rafId === null) {
        rafId = window.requestAnimationFrame(drawFrame);
      }
    };

    wakeUpRef.current = scheduleFrame;

    const handlePointerMove = (e: PointerEvent) => {
      lastClientX = e.clientX;
      lastClientY = e.clientY;
      pointerActive = true;
      scheduleFrame();
    };

    const handlePointerLeave = () => {
      pointerActive = false;
      scheduleFrame();
    };

    const handleMotionChange = () => {
      scheduleFrame();
    };

    const themeObserver = new MutationObserver(() => {
      isDark = document.documentElement.classList.contains("dark");
      scheduleFrame();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const resizeObserver = new ResizeObserver(() => {
      updateCanvasSize();
      scheduleFrame();
    });
    resizeObserver.observe(container);

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("scroll", scheduleFrame, { passive: true });
    document.documentElement.addEventListener("mouseleave", handlePointerLeave);
    window.addEventListener("blur", handlePointerLeave);
    reducedMotionQuery.addEventListener("change", handleMotionChange);

    updateCanvasSize();
    scheduleFrame();

    return () => {
      wakeUpRef.current = null;
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      themeObserver.disconnect();
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("scroll", scheduleFrame);
      document.documentElement.removeEventListener("mouseleave", handlePointerLeave);
      window.removeEventListener("blur", handlePointerLeave);
      reducedMotionQuery.removeEventListener("change", handleMotionChange);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="no-print pointer-events-none absolute inset-0 overflow-hidden"
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
