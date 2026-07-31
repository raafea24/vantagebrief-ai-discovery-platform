"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type NavigatorWithConnection = Navigator & {
  connection?: { saveData?: boolean };
};

export function HeroCinematicVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isVisibleRef = useRef(false);
  const isDocumentVisibleRef = useRef(true);
  const reducedMotionRef = useRef(true);
  const autoplayRejectedRef = useRef(false);
  const [sourcesEnabled, setSourcesEnabled] = useState(false);

  const attemptPlayback = useCallback(async () => {
    const video = videoRef.current;

    if (!video || autoplayRejectedRef.current) {
      return;
    }

    try {
      await video.play();
    } catch {
      autoplayRejectedRef.current = true;
    }
  }, []);

  const synchronizePlayback = useCallback(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    const shouldPlay =
      sourcesEnabled &&
      isVisibleRef.current &&
      isDocumentVisibleRef.current &&
      !reducedMotionRef.current &&
      !autoplayRejectedRef.current;

    if (shouldPlay) {
      void attemptPlayback();
    } else {
      video.pause();
    }
  }, [attemptPlayback, sourcesEnabled]);

  useEffect(() => {
    const video = videoRef.current;
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const navigatorWithConnection = navigator as NavigatorWithConnection;

    reducedMotionRef.current = motionQuery.matches;
    isDocumentVisibleRef.current = document.visibilityState === "visible";

    const sourceTimer = !navigatorWithConnection.connection?.saveData
      ? window.setTimeout(() => setSourcesEnabled(true), 0)
      : undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting && entry.intersectionRatio >= 0.55;
        synchronizePlayback();
      },
      { threshold: [0, 0.55, 1] },
    );

    if (video) {
      observer.observe(video);
    }

    const handleVisibilityChange = () => {
      isDocumentVisibleRef.current = document.visibilityState === "visible";
      synchronizePlayback();
    };

    const handleMotionChange = (event: MediaQueryListEvent) => {
      reducedMotionRef.current = event.matches;
      synchronizePlayback();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    motionQuery.addEventListener("change", handleMotionChange);

    return () => {
      if (sourceTimer !== undefined) {
        window.clearTimeout(sourceTimer);
      }
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      motionQuery.removeEventListener("change", handleMotionChange);
    };
  }, [synchronizePlayback]);

  useEffect(() => {
    if (sourcesEnabled) {
      videoRef.current?.load();
    }
  }, [sourcesEnabled]);

  const handleCanPlay = () => {
    synchronizePlayback();
  };

  return (
    <div className="hero-cinematic" id="discovery-preview">
      <video
        ref={videoRef}
        aria-hidden="true"
        loop
        muted
        playsInline
        poster="/images/hero/vantagebrief-hero-poster.webp"
        preload="metadata"
        tabIndex={-1}
        onCanPlay={handleCanPlay}
      >
        {sourcesEnabled ? (
          <>
            <source media="(max-width: 56rem)" src="/videos/hero/vantagebrief-hero-mobile.webm" type="video/webm" />
            <source media="(max-width: 56rem)" src="/videos/hero/vantagebrief-hero-mobile.mp4" type="video/mp4" />
            <source media="(min-width: 56.0625rem)" src="/videos/hero/vantagebrief-hero-desktop.webm" type="video/webm" />
            <source media="(min-width: 56.0625rem)" src="/videos/hero/vantagebrief-hero-desktop.mp4" type="video/mp4" />
          </>
        ) : null}
      </video>
    </div>
  );
}
