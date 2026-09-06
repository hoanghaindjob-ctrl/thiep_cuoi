# Vow — frontend

The Next.js half of the repo; this folder is what Vercel builds (set **Root
Directory: `vow`**). The database lives beside it in [`../supabase`](../supabase),
deployed separately — see the [root README](../README.md).

A mock-first invitation studio built with Next.js App Router, strict TypeScript, Tailwind CSS and Motion. The studio keeps a warm ivory editorial system; the guest invitation is *Minimalism Đỏ Đô* — burgundy, gold and cream, in Vietnamese, opening from a wax-sealed envelope.

## Run locally

```powershell
cd C:\Users\Lenovo\Desktop\thiep_cuoi\vow
npm install
Copy-Item .env.example .env.local   # then set STUDIO_PASSWORD
npm run dev
```

- Studio (đăng nhập): http://localhost:3000
- Khách mời: http://localhost:3000/guests
- Thiệp của một khách: http://localhost:3000/i/linh-and-minh/k7Np4xQw9a

`STUDIO_PASSWORD` is required — with it unset the studio returns 503 rather than
standing open. The guest invitation needs no login; that link *is* the invitation.

For production checks: `npm run lint`, `npm run build`, then `npm start`.

### Supabase

The schema is not in this folder — it is infrastructure, versioned separately in
[`../supabase`](../supabase/README.md). Apply it there (`supabase db push`, or
paste `../supabase/migrations/20260906000000_init.sql` into the SQL editor), then
put `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (Project Settings → API) into
`.env.local`. Use the **service role** key, and never prefix it with
`NEXT_PUBLIC_`.

Leave both blank and the app runs on an in-memory copy of `src/mocks`, which is
enough to exercise every screen but resets when the server restarts.

## Included

- A two-page studio, in Vietnamese: **Nội dung thiệp** (couple and photos, both families, the party and its timeline, album, music and section visibility) and **Khách mời**. Every editor field maps to something the guest actually sees.
- Saving goes to the server through `/api/invitation`, with explicit saved/unsaved feedback.
- Full-viewport personalized envelope with a gold 囍 wax seal, opening reveal, original ambient soundtrack, persistent music controls.
- Vietnamese invitation sections: lễ thành hôn with nhà trai / nhà gái, tiệc cưới with countdown and month calendar, bản đồ, dress code, lịch trình, album ảnh, hộp quà mừng and xác nhận tham dự.
- Lunar date derived from the chosen wedding date (`src/lib/lunar.ts`), an "Thêm vào lịch" Google Calendar link, and a 3D album carousel that advances itself and pauses on interaction.
- The invitation scrolls itself at 22px/second once opened. Any wheel, touch, pointer or key input hands control back; it resumes 5s after the reader goes still, or stays off for good if they press the button. Reduced-motion preferences disable automatic scrolling and ambient CSS motion.
- Guest creation, editing, reversible deletion, search, RSVP filtering, selection and single/multiple personalized link copying. New guests receive opaque random tokens.
- Reply status and seat counts are recorded by the hosts in the guest list; the invitation itself no longer carries an RSVP form.
- Invalid invitation links show a clear fallback instead of a generic guest invitation.

## Demo boundary

Data lives in Supabase and is reached only through `src/lib/db.ts`, called from
route handlers and server components. The browser never holds a database key:
RLS is on with no policies, so the anon key can read nothing, and the service
role key stays on the server. The studio and its write endpoints sit behind one
shared password checked in `src/middleware.ts`.

Known limits:

- **The Supabase path has not been run against a real project.** It was written
  and reviewed but not executed; the in-memory fallback is what the end-to-end
  checks exercised. Expect to shake out small things on first connection.
- Uploaded images and audio are inlined as data URIs inside the invitation row,
  capped at 3 MB per file. Supabase Storage is the right home for them.
- One shared password means one shared workspace — fine for a couple, not for a
  service with many couples.
- Copying links uses the Clipboard API, normally available on localhost/HTTPS.
  Mobile audio behaviour still deserves a check on real iOS/Android devices.

Two coherent editorial images were generated for this demo and optimized as local JPEGs. The seeded invitation plays a hosted track (`Lễ Đường.mp3`, ~4 MB, streamed from R2) and the music field is editable in the studio. `public/audio/always.wav` remains in the repo as an original procedural ambient composition; regenerate with `node scripts/create-soundtrack.mjs`. Fonts are self-hosted by `next/font` after build (the initial build needs access to Google Fonts). The invitation's peony spray, divider rosette and paper grain are drawn in `src/components/invitation/Ornaments.tsx` rather than shipped as artwork; `public/fonts/double-happiness.woff2` is a 1.1 KB single-glyph subset of Noto Serif TC (SIL Open Font License).

The venue section embeds a Google Maps frame, which is the one part of the invitation that reaches the network at view time.

See `docs/implementation.md` for design decisions and the deliberately deferred Supabase phase, and `docs/verification.md` for checks and remaining verification limits.
