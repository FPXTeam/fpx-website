"use client";

import { useEffect, useState } from "react";

const LOGO_SRC = "/images/brand-assets/fpx-logo-horizontal-green-gradient.png";

export default function LogoIntroPreview() {
  const [run, setRun] = useState(0);

  const replay = () => setRun((value) => value + 1);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "r" || event.code === "Space") {
        event.preventDefault();
        replay();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <main
      key={run}
      onClick={replay}
      aria-label="FPX logo animation preview. Click, press R, or press Space to replay."
      className="fpx-intro"
    >
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <div className="macro macro-a" aria-hidden="true">
        <img src={LOGO_SRC} alt="" draggable={false} />
      </div>

      <div className="macro macro-b" aria-hidden="true">
        <img src={LOGO_SRC} alt="" draggable={false} />
      </div>

      <div className="logo-stage" aria-hidden="true">
        <div className="logo-glow">
          <img src={LOGO_SRC} alt="" draggable={false} />
        </div>
        <div className="logo-main">
          <img src={LOGO_SRC} alt="" draggable={false} />
        </div>
        <div className="light-sweep" />
      </div>

      <style jsx>{`
        .fpx-intro {
          position: relative;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          cursor: pointer;
          background:
            radial-gradient(circle at 50% 44%, rgba(22, 64, 51, 0.42) 0%, rgba(7, 25, 21, 0.16) 33%, transparent 61%),
            linear-gradient(135deg, #020605 0%, #07100e 48%, #010403 100%);
          perspective: 1500px;
          isolation: isolate;
        }

        .ambient {
          position: absolute;
          border-radius: 999px;
          filter: blur(90px);
          pointer-events: none;
          opacity: 0;
          mix-blend-mode: screen;
        }

        .ambient-one {
          width: 42vw;
          height: 42vw;
          left: 7vw;
          top: 8vh;
          background: rgba(41, 217, 125, 0.14);
          animation: ambientIn 5s ease both;
        }

        .ambient-two {
          width: 34vw;
          height: 34vw;
          right: 4vw;
          bottom: 5vh;
          background: rgba(83, 195, 150, 0.1);
          animation: ambientIn 5s 0.15s ease both;
        }

        .macro,
        .logo-stage {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          pointer-events: none;
        }

        .macro img,
        .logo-stage img {
          display: block;
          user-select: none;
          -webkit-user-drag: none;
          image-rendering: auto;
        }

        /* First shot: extreme close-up, deliberately soft like the reference video. */
        .macro-a {
          opacity: 0;
          transform-style: preserve-3d;
          animation: macroA 1.5s cubic-bezier(.18,.72,.18,1) both;
        }

        .macro-a img {
          width: min(220vw, 3600px);
          max-width: none;
          filter: brightness(1.22) saturate(1.18) blur(1.2px) drop-shadow(0 0 22px rgba(83,195,150,.28));
        }

        /* Second shot: rotating / resolving logo. */
        .macro-b {
          opacity: 0;
          transform-style: preserve-3d;
          animation: macroB 1.85s 1.08s cubic-bezier(.16,.75,.18,1) both;
        }

        .macro-b img {
          width: min(118vw, 2100px);
          max-width: none;
          filter: brightness(1.18) saturate(1.15) drop-shadow(0 0 30px rgba(67,255,151,.24));
        }

        .logo-stage {
          opacity: 0;
          transform-style: preserve-3d;
          animation: stageIn 2.55s 2.45s cubic-bezier(.16,.78,.16,1) both;
        }

        .logo-main,
        .logo-glow {
          position: absolute;
          display: grid;
          place-items: center;
        }

        .logo-main img,
        .logo-glow img {
          width: min(61vw, 1180px);
          height: auto;
        }

        .logo-main {
          transform: translateZ(0);
          animation: logoSettle 2.3s 2.55s cubic-bezier(.16,.82,.18,1) both;
        }

        .logo-main img {
          filter: contrast(1.025) saturate(1.04);
        }

        .logo-glow {
          opacity: 0;
          filter: blur(24px);
          animation: glowPulse 2.2s 2.55s ease both;
        }

        .logo-glow img {
          opacity: .48;
          filter: brightness(1.25) saturate(1.2);
        }

        .light-sweep {
          position: absolute;
          width: min(64vw, 1240px);
          height: min(39vw, 720px);
          opacity: 0;
          overflow: hidden;
          mask-image: linear-gradient(#000, #000);
          animation: sweepWindow 1.05s 3.55s ease both;
        }

        .light-sweep::before {
          content: "";
          position: absolute;
          top: -20%;
          bottom: -20%;
          width: 13%;
          left: -18%;
          transform: skewX(-18deg);
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.32), transparent);
          filter: blur(9px);
          animation: sweepMove 1.05s 3.55s cubic-bezier(.2,.75,.18,1) both;
        }

        @keyframes macroA {
          0% {
            opacity: 0;
            transform: translate3d(37vw, 17vh, -80px) rotateZ(-7deg) rotateY(-18deg) scale(1.08);
          }
          13% { opacity: 1; }
          66% { opacity: 1; }
          100% {
            opacity: 0;
            transform: translate3d(6vw, -8vh, 120px) rotateZ(-2deg) rotateY(-7deg) scale(.89);
          }
        }

        @keyframes macroB {
          0% {
            opacity: 0;
            transform: translate3d(-25vw, 2vh, -180px) rotateY(108deg) rotateZ(2deg) scale(1.12);
          }
          18% { opacity: .95; }
          70% { opacity: .96; }
          100% {
            opacity: 0;
            transform: translate3d(7vw, 0, 80px) rotateY(3deg) rotateZ(0deg) scale(.76);
          }
        }

        @keyframes stageIn {
          0% {
            opacity: 0;
            transform: translateZ(-120px) scale(.72);
          }
          18% { opacity: 1; }
          100% {
            opacity: 1;
            transform: translateZ(0) scale(1);
          }
        }

        @keyframes logoSettle {
          0% {
            transform: rotateY(-38deg) rotateX(7deg) scale(.78);
            filter: blur(2.2px);
          }
          45% {
            transform: rotateY(4deg) rotateX(-1deg) scale(1.025);
            filter: blur(.25px);
          }
          72% {
            transform: rotateY(-1.5deg) rotateX(.5deg) scale(.997);
            filter: blur(0);
          }
          100% {
            transform: rotateY(0) rotateX(0) scale(1);
            filter: blur(0);
          }
        }

        @keyframes glowPulse {
          0% { opacity: 0; transform: scale(.78); }
          30% { opacity: .72; transform: scale(.93); }
          70% { opacity: .25; transform: scale(1.015); }
          100% { opacity: .08; transform: scale(1); }
        }

        @keyframes sweepWindow {
          0%, 6% { opacity: 0; }
          12%, 84% { opacity: 1; }
          100% { opacity: 0; }
        }

        @keyframes sweepMove {
          0% { left: -18%; }
          100% { left: 109%; }
        }

        @keyframes ambientIn {
          0% { opacity: 0; transform: scale(.85); }
          35% { opacity: .8; }
          100% { opacity: .42; transform: scale(1.08); }
        }

        @media (max-aspect-ratio: 4/3) {
          .logo-main img,
          .logo-glow img {
            width: min(82vw, 1180px);
          }

          .macro-b img {
            width: min(155vw, 2100px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .macro-a,
          .macro-b,
          .ambient,
          .logo-stage,
          .logo-main,
          .logo-glow,
          .light-sweep,
          .light-sweep::before {
            animation: none !important;
          }

          .logo-stage { opacity: 1; }
          .logo-main { transform: none; }
        }
      `}</style>
    </main>
  );
}
