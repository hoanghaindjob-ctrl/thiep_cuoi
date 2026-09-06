# Vow — experience first

Storage is Supabase, reached only from the server; the studio sits behind one
shared password. The database itself is not part of this folder — it lives in
`../supabase`, deployed on its own.

Routes: `/` invitation studio, `/guests` guest list, `/i/linh-and-minh/[token]` personalized story. Every read and write goes through `src/lib/db.ts` on the server; presentation receives domain objects. Nothing is kept in the browser, so a guest link created in the studio opens from any device.

Two visual systems, deliberately separate.

The **studio** (`/`, `/guests`) keeps its warm ivory paper, ink charcoal and muted olive, editorial serif paired with a modern sans. Its rules live in `src/app/globals.css`.

The **guest invitation** (`/i/...`) is *Minimalism Đỏ Đô*: a cream card standing in a burgundy room, then a cream page punctuated by burgundy cards with a peony bleeding off an alternating edge. Ink `#511419`, deep `#380a0e`, secondary `#8c3a3f`, gold `#c9a24a`, page `#fff7eb`, cream `#ece4d8`. Viaoda Libre sets names and numerals; Lora carries everything else, including the uppercase section headings. Gold is used only on burgundy — at 2.3:1 it cannot be read as text on cream. All of it is scoped under `.thiep` / `.thiep-bia` in `src/app/invitation.css`, so neither system can reach into the other.

Copy is Vietnamese throughout the invitation; the studio stays English. Dates render through `formatDate` at `vi-VN`, and `src/lib/lunar.ts` derives the lunar date printed beneath the solar one.

Motion is spent in one place: the envelope opening. Section reveals are limited to the three burgundy cards rather than every band. The seal, the peonies and the photo carry a slow idle drift; the album advances itself every 4.2s and stops the moment a reader takes over. Reduced motion disables the drifting petals, every idle animation, the carousel transition and auto-scroll. Auto-scroll is opt-in and stops on wheel, touch, keyboard or pointer interaction. Audio starts only from an explicit opening/play gesture.

Components separate studio forms, guest management, invitation sections, and motion controls. Native scrolling and Motion are sufficient; no GSAP dependency is necessary.

Storage is Supabase, behind `src/lib/db.ts`. The invitation is one `jsonb`
column rather than a table per sub-object: it is always read whole and written
whole, so splitting timeline/gallery/families/sections into their own tables
would buy four joins for a single row and a migration every time the card's
layout changes. Guests are a real table — they are looked up by token, filtered
by group and counted.

Every query runs on the server, with the service role key. The schema lives
outside this app, in `../supabase/migrations/` — deployed to Supabase, not to
Vercel. It enables RLS on both tables and creates no policies, so even a leaked
anon key reads nothing. `src/middleware.ts` gates `/`, `/guests` and the write endpoints
on a single `STUDIO_PASSWORD`, failing closed when it is unset; the guest link
stays public because that link is the invitation.

With no Supabase credentials the same module serves an in-memory copy of
`src/mocks`, pinned to `globalThis` — Next compiles route handlers and server
components into separate module graphs, and a plain module constant would give
the API and the page two different stores.
