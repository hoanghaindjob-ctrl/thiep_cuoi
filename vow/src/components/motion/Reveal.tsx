"use client";
import { motion, useReducedMotion } from "motion/react";

/**
 * Scroll reveals for the invitation.
 *
 * Each block enters the way its own shape suggests — a card rises, the two
 * portraits swing in from their own sides, a photograph settles up out of a
 * slight scale — so the page feels handled rather than processed through one
 * effect. `once` means nothing re-animates on the way back up.
 */
const HIDDEN = {
  /** rises into place */
  len: { opacity: 0, y: 30 },
  /** arrives from the left */
  trai: { opacity: 0, x: -38 },
  /** arrives from the right */
  phai: { opacity: 0, x: 38 },
  /** settles out of a slight scale */
  hien: { opacity: 0, scale: 0.94 },
} as const;

const SHOWN = { opacity: 1, x: 0, y: 0, scale: 1 };

const TAGS = {
  div: motion.div,
  section: motion.section,
  figure: motion.figure,
  footer: motion.footer,
  li: motion.li,
} as const;

export function Reveal({
  children,
  className = "",
  id,
  variant = "len",
  delay = 0,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  variant?: keyof typeof HIDDEN;
  delay?: number;
  as?: keyof typeof TAGS;
}) {
  const reduced = useReducedMotion();
  const Tag = TAGS[as];
  return (
    <Tag
      id={id}
      className={className}
      initial={reduced ? false : HIDDEN[variant]}
      whileInView={SHOWN}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Tag>
  );
}
