"use client";
import { useRef, useState } from "react";
import Link from "next/link";

// Drop your screen recording here (see public/demo/README). MP4 is the safe
// baseline; add a WebM <source> above the MP4 one if you want smaller files.
const VIDEO_SRC = "/demo/build-todo-app.mp4";
const VIDEO_POSTER = "/demo/build-todo-app.jpg";

/**
 * Click-to-play demo video framed like an app window, with a CTA into the real
 * playground. The video uses `preload="none"` and only loads once the user hits
 * play, so it costs nothing on initial page load (keeps LCP clean).
 */
export default function BuildDemo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);

  const play = () => {
    videoRef.current?.play();
    setStarted(true);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Video card with window chrome */}
      <div className="rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--card)] shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
        <div className="flex items-center gap-2 h-10 px-4 border-b border-[var(--border-subtle)] bg-[var(--surface)]">
          <span className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          </span>
          <span className="ml-2 text-xs font-mono text-[var(--fg-subtle)]">
            todo-app — built live in OlumJS
          </span>
        </div>

        <div className="relative aspect-video bg-black">
          <video
            ref={videoRef}
            className="h-full w-full"
            poster={VIDEO_POSTER}
            preload="none"
            controls={started}
            playsInline
            onPlay={() => setStarted(true)}
            onEnded={() => setStarted(false)}
          >
            <source src={VIDEO_SRC} type="video/mp4" />
            {/* Add captions for accessibility once you have them:
            <track kind="captions" src="/demo/build-todo-app.vtt" srcLang="en" label="English" default /> */}
          </video>

          {!started && (
            <button
              onClick={play}
              aria-label="Play the build demo"
              className="group absolute inset-0 flex items-center justify-center bg-black/30 transition-colors hover:bg-black/20"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#25C97E] shadow-[0_0_40px_rgba(37,201,126,0.5)] transition-transform group-hover:scale-110">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#05261a" className="ml-1 relative left-[-2px]">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </button>
          )}
        </div>
      </div>

      {/* CTA into the real playground */}
      <div className="mt-8 flex flex-col items-center gap-3">
        <Link
          href="/playground/todo-app"
          className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-[#25C97E] rounded-xl hover:brightness-110 hover:scale-[1.02] active:scale-[0.99] transition-all duration-200 shadow-[0_0_32px_rgba(37,201,126,0.28),0_2px_8px_rgba(0,0,0,0.3)]"
        >
          Try it yourself in the playground
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M2 7h10M8 3l4 4-4 4" />
          </svg>
        </Link>
        <p className="text-xs font-mono text-[var(--fg-subtle)]">No install. Runs in your browser.</p>
      </div>
    </div>
  );
}
