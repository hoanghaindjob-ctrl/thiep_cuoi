"use client";
import { motion, useReducedMotion } from "motion/react";
import type { Invitation } from "@/types/invitation";
import { formatDate } from "@/lib/repository";
import { DoubleHappiness, PeonySpray, Rosette } from "./Ornaments";

const MAU = ["#c9a24a", "#a8323b", "#ece4d8", "#7a1f26"];

/**
 * Drifting petals. Every value is derived from the index rather than
 * Math.random, so the server and the client lay them out identically and
 * hydration does not have to repaint the whole layer.
 */
const CANH = Array.from({ length: 14 }, (_, i) => {
  const a = Math.abs(Math.sin(i * 2.7));
  const b = Math.abs(Math.cos(i * 1.9));
  return {
    left: (i * 137.508) % 96,
    size: 11 + a * 11,
    sway: (b - 0.5) * 90,
    duration: 17 + a * 9,
    delay: -((i * 1.9) % 24),
    color: MAU[i % MAU.length],
  };
});

export function InvitationCover({
  invitation: data,
  guestName,
  onOpen,
  preview = false,
}: {
  invitation: Invitation;
  guestName: string;
  onOpen?: () => void;
  preview?: boolean;
}) {
  const ceremonyEvent = data.ceremonyEvent[data.ceremonyType] ?? data.event;
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={`thiep-bia ${preview ? "bia--xem" : ""}`}
      lang="vi"
      exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 1.06 }}
      transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="bia-bui" aria-hidden="true">
        {CANH.map((c, i) => (
          <span
            key={i}
            className="bia-canh"
            style={
              {
                left: `${c.left}%`,
                color: c.color,
                "--lech": `${c.sway}px`,
                animationDuration: `${c.duration}s`,
                animationDelay: `${c.delay}s`,
              } as React.CSSProperties
            }
          >
            <Rosette size={c.size} />
          </span>
        ))}
      </div>

      <div className="bia-khung">
        <div className="bia-trien">
          <DoubleHappiness />
        </div>
        <div className="bia-the">
          <PeonySpray className="bia-hoa tren" />
          <PeonySpray className="bia-hoa duoi" />
          <div className="bia-noi-dung">
            <p className="bia-khach">
              Trân trọng kính mời
              <strong>{guestName}</strong>
            </p>
            <div className="bia-ten">
              {data.groom}
              <i>&</i>
              {data.bride}
            </div>
            <div className="hoa-van">
              <Rosette size={14} />
            </div>
            <div className="bia-ngay">
              {formatDate(ceremonyEvent.date, {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </div>
            <p className="bia-moi">{data.title}</p>
            <button className="bia-mo" onClick={onOpen} type="button">
              Mở thiệp
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
