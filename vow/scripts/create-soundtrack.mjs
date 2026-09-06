// Original, procedurally composed ambient soundtrack. No external recordings.
import fs from "node:fs";
const rate = 22050,
  duration = 32,
  count = rate * duration,
  pcm = Buffer.alloc(count * 2);
const chords = [
  [261.63, 329.63, 392, 493.88],
  [220, 261.63, 329.63, 440],
  [174.61, 220, 261.63, 349.23],
  [196, 246.94, 293.66, 392],
];
for (let i = 0; i < count; i++) {
  const t = i / rate;
  let s = 0;
  for (let n = 0; n < 32; n++) {
    const start = n * 0.9,
      dt = t - start;
    if (dt < 0 || dt > 7) continue;
    const f = chords[Math.floor(n / 8) % 4][n % 4];
    const env = (1 - Math.exp(-dt * 12)) * Math.exp(-dt * 0.7);
    s +=
      (Math.sin(2 * Math.PI * f * dt) +
        0.25 * Math.sin(2 * Math.PI * f * 2 * dt) +
        0.08 * Math.sin(2 * Math.PI * f * 3 * dt)) *
      env *
      0.1;
  }
  s *= Math.min(1, t / 2, (duration - t) / 4);
  pcm.writeInt16LE(Math.round(Math.max(-1, Math.min(1, s)) * 32767), i * 2);
}
const header = Buffer.alloc(44);
header.write("RIFF");
header.writeUInt32LE(36 + pcm.length, 4);
header.write("WAVE", 8);
header.write("fmt ", 12);
header.writeUInt32LE(16, 16);
header.writeUInt16LE(1, 20);
header.writeUInt16LE(1, 22);
header.writeUInt32LE(rate, 24);
header.writeUInt32LE(rate * 2, 28);
header.writeUInt16LE(2, 32);
header.writeUInt16LE(16, 34);
header.write("data", 36);
header.writeUInt32LE(pcm.length, 40);
fs.writeFileSync("public/audio/always.wav", Buffer.concat([header, pcm]));
