"use client";
import { useEffect, useRef } from "react";

// Drop your screen recording here (see public/demo/README). MP4 is the safe
// baseline; add a WebM <source> above the MP4 one if you want smaller files.
const VIDEO_SRC = "/demo/todo.mp4";
const VIDEO_POSTER = "/demo/todo-thumbnail.jpg";

/**
 * Muted, autoplaying, looping demo video framed like an app window, with a CTA
 * into the real playground. The video is muted so browsers allow autoplay; the
 * poster shows until the first frame is decoded. Controls are hidden.
 */
export default function BuildDemo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  // React doesn't always reflect the `muted` prop onto the DOM node, so force
  // it here to guarantee the autoplaying demo never plays sound.
  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = true;
  }, []);

  return (
    <div className="max-w-5xl mx-auto">
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
          <span className="ml-auto hidden sm:inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[#25C97E]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#25C97E] animate-pulse" />
            under 5 min
          </span>
        </div>

        <div className="relative bg-black">
          <video
            ref={videoRef}
            className="block w-full h-auto"
            poster={VIDEO_POSTER}
            preload="metadata"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src={VIDEO_SRC} type="video/mp4" />
            {/* Add captions for accessibility once you have them:
            <track kind="captions" src="/demo/build-todo-app.vtt" srcLang="en" label="English" default /> */}
          </video>
        </div>
      </div>

      {/* CTA into the real playground — a full page load so the playground's
          cross-origin isolation headers apply (WebContainers needs them). */}
      <div className="mt-8 flex flex-col items-center gap-3">
        <a
          href="/playground/todo-app"
          className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-[#25C97E] rounded-xl hover:brightness-110 hover:scale-[1.02] active:scale-[0.99] transition-all duration-200 shadow-[0_0_32px_rgba(37,201,126,0.28),0_2px_8px_rgba(0,0,0,0.3)]"
        >
          Try it yourself in the playground
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M2 7h10M8 3l4 4-4 4" />
          </svg>
        </a>
        <p className="text-xs font-mono text-[var(--fg-subtle)]">No install. Runs in your browser.</p>
      </div>
    </div>
  );
}
