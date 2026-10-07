"use client";

import { useEffect, useState } from "react";

const LOGO_SRC = "/images/brand-assets/fpx-logo-horizontal-green-gradient.png";
const DEPTH_LAYERS = Array.from({ length: 18 }, (_, index) => index);

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
      <div className="vignette" />
      <div className="bloom bloom-a" />
      <div className="bloom bloom-b" />
      <div className="streak streak-a" />
      <div className="streak streak-b" />

      <section className="shot shot-one" aria-hidden="true">
        <div className="shot-one-logo">
          {DEPTH_LAYERS.map((layer) => (
            <img
              key={`one-${layer}`}
              src={LOGO_SRC}
              alt=""
              draggable={false}
              className="depth-image"
              style={{ "--i": layer } as React.CSSProperties}
            />
          ))}
          <img src={LOGO_SRC} alt="" draggable={false} className="front-image" />
        </div>
      </section>

      <section className="shot shot-two" aria-hidden="true">
        <div className="shot-two-logo">
          {DEPTH_LAYERS.map((layer) => (
            <img
              key={`two-${layer}`}
              src={LOGO_SRC}
              alt=""
              draggable={false}
              className="depth-image"
              style={{ "--i": layer } as React.CSSProperties}
            />
          ))}
          <img src={LOGO_SRC} alt="" draggable={false} className="front-image" />
          <div className="specular" />
        </div>
      </section>

      <section className="final-stage" aria-hidden="true">
        <div className="final-halo">
          <img src={LOGO_SRC} alt="" draggable={false} />
        </div>
        <div className="final-logo">
          {Array.from({ length: 8 }, (_, index) => (
            <img
              key={`final-${index}`}
              src={LOGO_SRC}
              alt=""
              draggable={false}
              className="final-depth"
              style={{ "--i": index } as React.CSSProperties}
            />
          ))}
          <img src={LOGO_SRC} alt="" draggable={false} className="final-front" />
          <div className="final-shine" />
        </div>
      </section>

      <style jsx>{`
        .fpx-intro {
          position: relative;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          cursor: pointer;
          background:
            radial-gradient(circle at 55% 45%, rgba(12, 54, 41, 0.44) 0%, rgba(3, 15, 12, 0.22) 35%, transparent 64%),
            linear-gradient(145deg, #010303 0%, #07100e 48%, #010202 100%);
          perspective: 1800px;
          isolation: isolate;
        }

        .vignette {
          position: absolute;
          inset: -8%;
          z-index: 20;
          pointer-events: none;
          background: radial-gradient(circle at center, transparent 43%, rgba(0,0,0,.5) 76%, rgba(0,0,0,.86) 100%);
        }

        .bloom {
          position: absolute;
          border-radius: 999px;
          filter: blur(100px);
          opacity: 0;
          mix-blend-mode: screen;
          pointer-events: none;
          z-index: 1;
        }

        .bloom-a {
          width: 54vw;
          height: 54vw;
          left: -8vw;
          top: -12vh;
          background: rgba(0, 255, 126, .16);
          animation: bloomA 5s ease both;
        }

        .bloom-b {
          width: 42vw;
          height: 42vw;
          right: -2vw;
          bottom: -10vh;
          background: rgba(77, 139, 255, .10);
          animation: bloomB 5s .1s ease both;
        }

        .streak {
          position: absolute;
          height: 180vh;
          width: 14vw;
          top: -40vh;
          opacity: 0;
          filter: blur(20px);
          transform: rotate(18deg);
          mix-blend-mode: screen;
          pointer-events: none;
          z-index: 8;
        }

        .streak-a {
          left: -15vw;
          background: linear-gradient(90deg, transparent, rgba(146,255,205,.22), rgba(255,255,255,.22), transparent);
          animation: streakA 1.35s .35s cubic-bezier(.18,.75,.18,1) both;
        }

        .streak-b {
          right: -18vw;
          background: linear-gradient(90deg, transparent, rgba(83,195,150,.12), rgba(255,255,255,.18), transparent);
          animation: streakB 1.05s 2.35s cubic-bezier(.18,.75,.18,1) both;
        }

        .shot,
        .final-stage {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          pointer-events: none;
          transform-style: preserve-3d;
        }

        .shot img,
        .final-stage img {
          display: block;
          user-select: none;
          -webkit-user-drag: none;
          image-rendering: auto;
          backface-visibility: hidden;
        }

        .shot-one {
          opacity: 0;
          z-index: 4;
          animation: shotOneWindow 1.52s cubic-bezier(.18,.75,.18,1) both;
        }

        .shot-one-logo {
          position: relative;
          width: min(152vw, 3000px);
          aspect-ratio: 1536 / 1024;
          transform-style: preserve-3d;
          animation: shotOneMove 1.52s cubic-bezier(.12,.72,.12,1) both;
        }

        .shot-two {
          opacity: 0;
          z-index: 5;
          animation: shotTwoWindow 1.95s .92s cubic-bezier(.18,.75,.18,1) both;
        }

        .shot-two-logo {
          position: relative;
          width: min(88vw, 1900px);
          aspect-ratio: 1536 / 1024;
          transform-style: preserve-3d;
          animation: shotTwoMove 1.95s .92s cubic-bezier(.12,.78,.14,1) both;
        }

        .depth-image,
        .front-image,
        .final-depth,
        .final-front {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .shot-one .depth-image {
          opacity: .26;
          filter: brightness(.34) saturate(1.3) drop-shadow(0 0 10px rgba(0,255,128,.18));
          transform: translate3d(calc(var(--i) * -2.2px), calc(var(--i) * 1.5px), calc(var(--i) * -3.2px));
        }

        .shot-one .front-image {
          filter: brightness(1.42) saturate(1.16) blur(.9px) drop-shadow(0 0 34px rgba(83,195,150,.42));
        }

        .shot-two .depth-image {
          opacity: .34;
          filter: brightness(.28) saturate(1.2);
          transform: translate3d(calc(var(--i) * -2.6px), calc(var(--i) * 1.3px), calc(var(--i) * -4px));
        }

        .shot-two .front-image {
          filter: brightness(1.22) saturate(1.13) contrast(1.05) drop-shadow(0 0 26px rgba(52,255,147,.34));
        }

        .specular {
          position: absolute;
          inset: 18% 7% 16%;
          opacity: 0;
          overflow: hidden;
          mix-blend-mode: screen;
          animation: specularWindow .95s 1.5s ease both;
        }

        .specular::before {
          content: "";
          position: absolute;
          width: 13%;
          height: 180%;
          left: -20%;
          top: -38%;
          transform: rotate(16deg);
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.68), rgba(122,255,197,.38), transparent);
          filter: blur(10px);
          animation: specularMove .95s 1.5s cubic-bezier(.2,.72,.18,1) both;
        }

        .final-stage {
          opacity: 0;
          z-index: 7;
          animation: finalWindow 2.75s 2.25s ease both;
        }

        .final-logo {
          position: relative;
          width: min(58vw, 1180px);
          aspect-ratio: 1536 / 1024;
          transform-style: preserve-3d;
          animation: finalSettle 2.65s 2.28s cubic-bezier(.14,.82,.16,1) both;
        }

        .final-depth {
          opacity: .25;
          filter: brightness(.35) saturate(1.25);
          transform: translate3d(calc(var(--i) * -1.4px), calc(var(--i) * 1px), calc(var(--i) * -2px));
        }

        .final-front {
          filter: contrast(1.035) saturate(1.04) drop-shadow(0 12px 28px rgba(0,0,0,.35));
        }

        .final-halo {
          position: absolute;
          display: grid;
          place-items: center;
          opacity: 0;
          filter: blur(42px);
          animation: halo 2.55s 2.3s ease both;
        }

        .final-halo img {
          width: min(61vw, 1240px);
          opacity: .52;
          filter: brightness(1.3) saturate(1.35);
        }

        .final-shine {
          position: absolute;
          inset: 15% 5% 16%;
          overflow: hidden;
          opacity: 0;
          mix-blend-mode: screen;
          animation: finalShineWindow .9s 3.35s ease both;
        }

        .final-shine::before {
          content: "";
          position: absolute;
          top: -35%;
          bottom: -35%;
          left: -22%;
          width: 10%;
          transform: skewX(-18deg);
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.38), transparent);
          filter: blur(8px);
          animation: finalShineMove .9s 3.35s cubic-bezier(.2,.72,.16,1) both;
        }

        @keyframes shotOneWindow {
          0% { opacity: 0; }
          8% { opacity: 1; }
          68% { opacity: 1; }
          100% { opacity: 0; }
        }

        @keyframes shotOneMove {
          0% {
            transform: translate3d(44vw, 8vh, -260px) rotateY(-78deg) rotateX(10deg) rotateZ(-8deg) scale(1.32);
            filter: blur(5px);
          }
          20% { filter: blur(1.8px); }
          58% {
            transform: translate3d(8vw, -7vh, 120px) rotateY(-26deg) rotateX(4deg) rotateZ(-3deg) scale(1.08);
            filter: blur(.8px);
          }
          100% {
            transform: translate3d(-14vw, -5vh, 260px) rotateY(-5deg) rotateX(1deg) rotateZ(-1deg) scale(.9);
            filter: blur(2.2px);
          }
        }

        @keyframes shotTwoWindow {
          0% { opacity: 0; }
          10% { opacity: 1; }
          72% { opacity: 1; }
          100% { opacity: 0; }
        }

        @keyframes shotTwoMove {
          0% {
            transform: translate3d(-22vw, 2vh, -420px) rotateY(112deg) rotateX(-7deg) rotateZ(3deg) scale(.92);
            filter: blur(3.5px);
          }
          24% {
            transform: translate3d(-8vw, 0, -110px) rotateY(54deg) rotateX(-3deg) rotateZ(1deg) scale(1.02);
            filter: blur(1.1px);
          }
          66% {
            transform: translate3d(4vw, -1vh, 110px) rotateY(-8deg) rotateX(1deg) rotateZ(0deg) scale(1.06);
            filter: blur(.35px);
          }
          100% {
            transform: translate3d(3vw, 0, 0) rotateY(1deg) rotateX(0) rotateZ(0) scale(.78);
            filter: blur(1.7px);
          }
        }

        @keyframes finalWindow {
          0% { opacity: 0; }
          13% { opacity: 1; }
          100% { opacity: 1; }
        }

        @keyframes finalSettle {
          0% {
            transform: translate3d(0, 2vh, -320px) rotateY(-48deg) rotateX(8deg) scale(.62);
            filter: blur(3.2px);
          }
          37% {
            transform: translate3d(0, 0, 75px) rotateY(6deg) rotateX(-1.4deg) scale(1.035);
            filter: blur(.3px);
          }
          58% {
            transform: translate3d(0, 0, 0) rotateY(-2deg) rotateX(.7deg) scale(.992);
            filter: blur(0);
          }
          76% {
            transform: translate3d(0, 0, 0) rotateY(.5deg) rotateX(0) scale(1.003);
          }
          100% {
            transform: translate3d(0, 0, 0) rotateY(0) rotateX(0) scale(1);
            filter: blur(0);
          }
        }

        @keyframes halo {
          0% { opacity: 0; transform: scale(.68); }
          26% { opacity: .74; transform: scale(.9); }
          54% { opacity: .32; transform: scale(1.02); }
          100% { opacity: .08; transform: scale(1); }
        }

        @keyframes specularWindow {
          0%, 5% { opacity: 0; }
          12%, 86% { opacity: 1; }
          100% { opacity: 0; }
        }

        @keyframes specularMove {
          0% { left: -20%; }
          100% { left: 112%; }
        }

        @keyframes finalShineWindow {
          0%, 7% { opacity: 0; }
          15%, 85% { opacity: 1; }
          100% { opacity: 0; }
        }

        @keyframes finalShineMove {
          0% { left: -22%; }
          100% { left: 112%; }
        }

        @keyframes streakA {
          0% { opacity: 0; transform: translateX(0) rotate(18deg); }
          20% { opacity: .8; }
          100% { opacity: 0; transform: translateX(128vw) rotate(18deg); }
        }

        @keyframes streakB {
          0% { opacity: 0; transform: translateX(0) rotate(18deg); }
          20% { opacity: .62; }
          100% { opacity: 0; transform: translateX(-128vw) rotate(18deg); }
        }

        @keyframes bloomA {
          0% { opacity: 0; transform: scale(.72); }
          24% { opacity: .82; }
          100% { opacity: .32; transform: scale(1.15); }
        }

        @keyframes bloomB {
          0% { opacity: 0; transform: scale(.8); }
          32% { opacity: .6; }
          100% { opacity: .24; transform: scale(1.1); }
        }

        @media (max-aspect-ratio: 4/3) {
          .shot-one-logo { width: min(210vw, 3000px); }
          .shot-two-logo { width: min(128vw, 1900px); }
          .final-logo { width: min(82vw, 1180px); }
          .final-halo img { width: min(86vw, 1240px); }
        }

        @media (prefers-reduced-motion: reduce) {
          .shot-one,
          .shot-two,
          .final-stage,
          .shot-one-logo,
          .shot-two-logo,
          .final-logo,
          .bloom,
          .streak,
          .specular,
          .specular::before,
          .final-halo,
          .final-shine,
          .final-shine::before {
            animation: none !important;
          }
          .shot-one,
          .shot-two { display: none; }
          .final-stage { opacity: 1; }
          .final-logo { transform: none; }
        }
      `}</style>
    </main>
  );
}
