import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { HeroCinematicVideo } from "./HeroCinematicVideo";

let intersectionCallback: IntersectionObserverCallback;
let reducedMotion = false;

class IntersectionObserverMock implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = "0px";
  readonly scrollMargin = "0px";
  readonly thresholds = [0, 0.55, 1];

  constructor(callback: IntersectionObserverCallback) {
    intersectionCallback = callback;
  }

  disconnect = vi.fn();
  observe = vi.fn();
  takeRecords = vi.fn(() => []);
  unobserve = vi.fn();
}

function setVideoVisible(video: HTMLVideoElement) {
  act(() => {
    intersectionCallback(
      [
        {
          isIntersecting: true,
          intersectionRatio: 0.8,
          target: video,
        } as unknown as IntersectionObserverEntry,
      ],
      {} as IntersectionObserver,
    );
  });
}

describe("HeroCinematicVideo", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    reducedMotion = false;
    sessionStorage.clear();
    vi.stubGlobal("IntersectionObserver", IntersectionObserverMock);
    vi.stubGlobal(
      "matchMedia",
      vi.fn(() => ({
        matches: reducedMotion,
        media: "(prefers-reduced-motion: reduce)",
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    );
  });

  it("loads responsive sources and starts playback when mostly visible", async () => {
    const play = vi
      .spyOn(HTMLMediaElement.prototype, "play")
      .mockResolvedValue(undefined);
    vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => undefined);
    vi.spyOn(HTMLMediaElement.prototype, "load").mockImplementation(() => undefined);

    const { container } = render(<HeroCinematicVideo />);
    const video = container.querySelector("video");

    expect(video).not.toBeNull();
    expect(video).toHaveAttribute(
      "poster",
      "/images/hero/vantagebrief-hero-poster.webp",
    );
    expect(screen.queryByRole("button")).not.toBeInTheDocument();

    await waitFor(() => expect(container.querySelectorAll("source")).toHaveLength(4));
    setVideoVisible(video as HTMLVideoElement);
    fireEvent.canPlay(video as HTMLVideoElement);

    await waitFor(() => expect(play).toHaveBeenCalled());
  });

  it("does not autoplay when reduced motion is requested", async () => {
    reducedMotion = true;
    const play = vi
      .spyOn(HTMLMediaElement.prototype, "play")
      .mockResolvedValue(undefined);
    vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => undefined);
    vi.spyOn(HTMLMediaElement.prototype, "load").mockImplementation(() => undefined);

    const { container } = render(<HeroCinematicVideo />);
    const video = container.querySelector("video") as HTMLVideoElement;

    await waitFor(() => expect(container.querySelectorAll("source")).toHaveLength(4));
    setVideoVisible(video);
    fireEvent.canPlay(video);

    expect(play).not.toHaveBeenCalled();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
