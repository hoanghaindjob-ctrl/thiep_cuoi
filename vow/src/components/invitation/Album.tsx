"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "motion/react";
import type { GalleryItem } from "@/types/invitation";

const DELAY = 4200;
/** How many photos stay visible either side of the active one. */
const DEPTH = 3;

/**
 * The wedding album as a rotating fan: the active photo stands upright in the
 * centre, its neighbours fall away in perspective, and the stack advances on
 * its own. Autoplay pauses whenever a reader takes over — pointer, focus or
 * keyboard — and never starts under reduced motion, where this becomes a plain
 * manual carousel.
 */
export function Album({ items }: { items: GalleryItem[] }) {
  const [active, setActive] = useState(0);
  const [held, setHeld] = useState(false);
  const reduced = useReducedMotion();
  const count = items.length;

  useEffect(() => {
    if (reduced || held || count < 2) return;
    const id = setInterval(() => setActive((i) => (i + 1) % count), DELAY);
    return () => clearInterval(id);
  }, [reduced, held, count]);

  if (!count) return null;

  const go = (dir: number) => setActive((i) => (i + dir + count) % count);

  return (
    <div
      className="album-vong"
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocusCapture={() => setHeld(true)}
      onBlurCapture={() => setHeld(false)}
      role="group"
      aria-roledescription="băng ảnh"
      aria-label="Album ảnh cưới"
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          go(-1);
        }
        if (e.key === "ArrowRight") {
          e.preventDefault();
          go(1);
        }
      }}
    >
      <div className="album-khung">
        <div className="album-san">
          {items.map((item, i) => {
            // shortest signed distance around the ring
            let d = i - active;
            if (d > count / 2) d -= count;
            if (d < -count / 2) d += count;
            const step = Math.min(Math.abs(d), DEPTH);
            return (
              <figure
                key={item.id}
                className="album-the"
                aria-hidden={d !== 0}
                style={{
                  transform: `translateX(calc(-50% + ${d * 46}%)) rotateY(${
                    d * -40
                  }deg) scale(${d === 0 ? 1 : 0.86 - (step - 1) * 0.13})`,
                  opacity: Math.abs(d) > DEPTH ? 0 : 1 - step * 0.16,
                  zIndex: 10 - step,
                  pointerEvents: d === 0 ? "auto" : "none",
                }}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 700px) 58vw, 260px"
                />
              </figure>
            );
          })}
        </div>
        <button
          type="button"
          className="album-lui"
          aria-label="Ảnh trước"
          onClick={() => go(-1)}
        >
          ‹
        </button>
        <button
          type="button"
          className="album-toi"
          aria-label="Ảnh kế tiếp"
          onClick={() => go(1)}
        >
          ›
        </button>
      </div>

      <p className="album-chu" aria-live="polite">
        {items[active]?.caption}
      </p>

      <div className="album-cham">
        {items.map((item, i) => (
          <button
            key={item.id}
            type="button"
            aria-label={`Ảnh ${i + 1}`}
            aria-current={i === active}
            className={i === active ? "dang" : undefined}
            onClick={() => setActive(i)}
          />
        ))}
      </div>
    </div>
  );
}
