"use client";
import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

/** Pixels per millisecond — roughly 34px a second, a reading pace. */
const SPEED = 0.034;
/** Let the cover finish fading out before anything moves. */
const START_DELAY = 1600;
/** How long a reader's own scrolling holds the journey before it picks up. */
const RESUME_AFTER = 5000;

/**
 * Carries the reader down the invitation on its own.
 *
 * The reader always wins: any wheel, touch, pointer or key input hands control
 * straight back and holds it. The journey only resumes once they have been
 * still for RESUME_AFTER — and never at all if they switched it off with the
 * button, which is the difference between being interrupted and being
 * dismissed. Touching the floating controls themselves does not count as
 * interruption, so toggling the music does not stop the scroll.
 */
export function AutoScrollController({
  autoStart = false,
}: {
  autoStart?: boolean;
}) {
  const reduced = useReducedMotion();
  const [on, setOn] = useState(autoStart);
  const [held, setHeld] = useState(autoStart);

  useEffect(() => {
    if (!autoStart) return;
    const t = setTimeout(() => setHeld(false), START_DELAY);
    return () => clearTimeout(t);
  }, [autoStart]);

  useEffect(() => {
    if (reduced || !on) return;
    let timer: ReturnType<typeof setTimeout>;
    const standDown = (event: Event) => {
      if (
        event.target instanceof Element &&
        event.target.closest(".dieu-khien")
      ) {
        return;
      }
      setHeld(true);
      clearTimeout(timer);
      timer = setTimeout(() => setHeld(false), RESUME_AFTER);
    };
    const events = [
      "wheel",
      "touchstart",
      "touchmove",
      "pointerdown",
      "keydown",
    ] as const;
    events.forEach((e) =>
      window.addEventListener(e, standDown, { passive: true }),
    );
    return () => {
      clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, standDown));
    };
  }, [reduced, on]);

  useEffect(() => {
    if (reduced || !on || held) return;
    let frame = 0;
    let last = 0;
    // Pick up from wherever the reader left off, not from where we stopped.
    let position = window.scrollY;
    const step = (now: number) => {
      if (last) {
        position += Math.min(now - last, 50) * SPEED;
        window.scrollTo(0, position);
      }
      last = now;
      if (
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 3
      ) {
        setOn(false);
        return;
      }
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [reduced, on, held]);

  if (reduced) return null;
  return (
    <button
      className="auto-control"
      aria-pressed={on}
      aria-label={on ? "Dừng tự cuộn" : "Bật tự cuộn"}
      title={on ? "Dừng tự cuộn" : "Bật tự cuộn"}
      onClick={() => {
        setHeld(false);
        setOn((v) => !v);
      }}
    >
      {on ? "Ⅱ" : "↓"}
    </button>
  );
}
