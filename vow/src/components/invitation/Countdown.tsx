"use client";
import { useEffect, useState } from "react";

const O = [
  ["ngay", "Ngày"],
  ["gio", "Giờ"],
  ["phut", "Phút"],
  ["giay", "Giây"],
] as const;

function con_lai(target: number, now: number) {
  const s = Math.floor(Math.max(0, target - now) / 1000);
  return {
    ngay: Math.floor(s / 86400),
    gio: Math.floor(s / 3600) % 24,
    phut: Math.floor(s / 60) % 60,
    giay: s % 60,
  };
}

/**
 * Counts down to the ceremony.
 *
 * The clock is only read after mount — the answer depends on the reader's
 * device time, so committing to one while rendering would guarantee a
 * hydration mismatch. The first read is scheduled on the next frame rather
 * than run inline, which keeps it out of the effect body and still fills the
 * dashes in before anyone sees them.
 */
export function Countdown({ date, time }: { date: string; time: string }) {
  const target = new Date(`${date}T${time || "00:00"}:00`).getTime();
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setNow(Date.now()));
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => {
      cancelAnimationFrame(frame);
      clearInterval(id);
    };
  }, []);

  if (Number.isNaN(target)) return null;
  const left = now === null ? null : con_lai(target, now);

  return (
    <div className="dem-nguoc" role="timer" aria-live="off">
      {O.map(([key, label]) => (
        <div key={key}>
          <b>{left ? String(left[key]).padStart(2, "0") : "––"}</b>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}
