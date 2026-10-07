"use client";

import { useCallback, useEffect, useRef } from "react";

const DURATION = 5000;
const LOGO_SRC = "/images/brand-assets/fpx-logo-horizontal-green-gradient.png";

export default function LogoIntroPreview() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const replayRef = useRef<() => void>(() => {});

  const setup = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let start = performance.now();
    let ready = false;

    const logo = new Image();
    logo.src = LOGO_SRC;

    const edgeCanvas = document.createElement("canvas");
    const edgeCtx = edgeCanvas.getContext("2d");

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const buildEdgeMap = () => {
      if (!edgeCtx || !logo.naturalWidth || !logo.naturalHeight) return;

      const workingWidth = Math.min(1400, logo.naturalWidth);
      const workingHeight = Math.max(1, Math.round(workingWidth * (logo.naturalHeight / logo.naturalWidth)));

      edgeCanvas.width = workingWidth;
      edgeCanvas.height = workingHeight;
      edgeCtx.clearRect(0, 0, workingWidth, workingHeight);
      edgeCtx.drawImage(logo, 0, 0, workingWidth, workingHeight);

      const image = edgeCtx.getImageData(0, 0, workingWidth, workingHeight);
      const source = new Uint8ClampedArray(image.data);
      const output = image.data;
      const stride = workingWidth * 4;

      for (let y = 0; y < workingHeight; y += 1) {
        for (let x = 0; x < workingWidth; x += 1) {
          const i = y * stride + x * 4;
          const a = source[i + 3];
          if (a < 35) {
            output[i + 3] = 0;
            continue;
          }

          const radius = 2;
          const left = x >= radius ? source[i - radius * 4 + 3] : 0;
          const right = x + radius < workingWidth ? source[i + radius * 4 + 3] : 0;
          const up = y >= radius ? source[i - radius * stride + 3] : 0;
          const down = y + radius < workingHeight ? source[i + radius * stride + 3] : 0;
          const isEdge = left < 35 || right < 35 || up < 35 || down < 35;

          if (isEdge) {
            output[i] = 120;
            output[i + 1] = 238;
            output[i + 2] = 190;
            output[i + 3] = 235;
          } else {
            output[i + 3] = 0;
          }
        }
      }

      edgeCtx.putImageData(image, 0, 0);
    };

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
    const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

    const draw = (now: number) => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const elapsed = now - start;
      const t = Math.min(elapsed / DURATION, 1);

      ctx.clearRect(0, 0, width, height);

      const bg = ctx.createRadialGradient(width * 0.5, height * 0.46, 0, width * 0.5, height * 0.46, Math.max(width, height) * 0.72);
      bg.addColorStop(0, "#0b2620");
      bg.addColorStop(0.48, "#071715");
      bg.addColorStop(1, "#020707");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      if (!ready) {
        raf = requestAnimationFrame(draw);
        return;
      }

      const maxLogoWidth = Math.min(width * 0.78, 1400);
      const maxLogoHeight = height * 0.72;
      const naturalRatio = logo.naturalWidth / logo.naturalHeight;
      let drawWidth = maxLogoWidth;
      let drawHeight = drawWidth / naturalRatio;
      if (drawHeight > maxLogoHeight) {
        drawHeight = maxLogoHeight;
        drawWidth = drawHeight * naturalRatio;
      }
      const x = (width - drawWidth) / 2;
      const y = (height - drawHeight) / 2;

      // Subtle stage glow behind the logo.
      const glowOpacity = clamp01((elapsed - 150) / 700) * 0.22;
      ctx.save();
      ctx.globalAlpha = glowOpacity;
      ctx.filter = "blur(45px)";
      ctx.drawImage(logo, x, y, drawWidth, drawHeight);
      ctx.restore();

      // 1) Draw the logo contour from left to right.
      const trace = easeOutCubic(clamp01((elapsed - 300) / 2050));
      if (trace > 0) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(x, y, drawWidth * trace, drawHeight);
        ctx.clip();
        ctx.globalAlpha = 0.95;
        ctx.shadowColor = "rgba(83,195,150,0.65)";
        ctx.shadowBlur = 12;
        ctx.drawImage(edgeCanvas, x, y, drawWidth, drawHeight);
        ctx.restore();

        if (trace < 0.995) {
          const sweepX = x + drawWidth * trace;
          const line = ctx.createLinearGradient(sweepX - 26, 0, sweepX + 26, 0);
          line.addColorStop(0, "rgba(83,195,150,0)");
          line.addColorStop(0.5, "rgba(214,255,238,.95)");
          line.addColorStop(1, "rgba(83,195,150,0)");
          ctx.fillStyle = line;
          ctx.fillRect(sweepX - 26, y - 16, 52, drawHeight + 32);
        }
      }

      // 2) Resolve into the full-color logo with a diagonal reveal.
      const fill = easeOutCubic(clamp01((elapsed - 1550) / 1750));
      if (fill > 0) {
        const revealX = x - drawWidth * 0.08 + drawWidth * 1.16 * fill;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x - 40, y - 30);
        ctx.lineTo(revealX + 90, y - 30);
        ctx.lineTo(revealX - 30, y + drawHeight + 30);
        ctx.lineTo(x - 40, y + drawHeight + 30);
        ctx.closePath();
        ctx.clip();
        ctx.globalAlpha = Math.min(1, 0.36 + fill * 0.76);
        ctx.drawImage(logo, x, y, drawWidth, drawHeight);
        ctx.restore();
      }

      // 3) Bright, restrained light sweep over the finished mark.
      const sweep = clamp01((elapsed - 3000) / 900);
      if (sweep > 0 && sweep < 1) {
        const sx = x - drawWidth * 0.18 + drawWidth * 1.36 * sweep;
        ctx.save();
        ctx.globalCompositeOperation = "screen";
        const shine = ctx.createLinearGradient(sx - 90, 0, sx + 90, 0);
        shine.addColorStop(0, "rgba(255,255,255,0)");
        shine.addColorStop(0.5, "rgba(255,255,255,.28)");
        shine.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = shine;
        ctx.fillRect(sx - 90, y, 180, drawHeight);
        ctx.restore();
      }

      // 4) Final crisp hold.
      if (elapsed >= 3650) {
        const finalFade = easeOutCubic(clamp01((elapsed - 3650) / 450));
        ctx.save();
        ctx.globalAlpha = finalFade;
        ctx.drawImage(logo, x, y, drawWidth, drawHeight);
        ctx.restore();
      }

      if (t < 1) raf = requestAnimationFrame(draw);
    };

    replayRef.current = () => {
      start = performance.now();
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);

    logo.onload = () => {
      buildEdgeMap();
      ready = true;
      start = performance.now() + 250;
      raf = requestAnimationFrame(draw);
    };

    logo.onerror = () => {
      ready = false;
    };

    const handleKey = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "r" || event.code === "Space") {
        event.preventDefault();
        replayRef.current();
      }
    };
    window.addEventListener("keydown", handleKey);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", handleKey);
    };
  }, []);

  useEffect(() => setup(), [setup]);

  return (
    <main
      onClick={() => replayRef.current()}
      aria-label="FPX logo animation preview. Click, press R, or press Space to replay."
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "#020707",
        cursor: "pointer",
      }}
    >
      <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%" }} />
    </main>
  );
}
