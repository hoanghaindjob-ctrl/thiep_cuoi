# Phase 1 verification — 2026-09-06

## Passed

- `npm run lint`: zero errors or warnings.
- `npm run build`: production compilation, strict TypeScript, static studio/guest pages and dynamic personalized invitation route.
- In-app browser: editor name changes immediately update the cover preview; saving succeeds; all four editor chapters render; section checkboxes toggle.
- Personalized cover displays the correct seeded guest name. Opening reveals the story, releases the page scroll lock and moves focus into the invitation.
- Audio after opening: HTMLMediaElement reported `paused: false`, `readyState: 4`. Pause button changes back to Play music.
- Corrected auto-scroll accumulates fractional positions: observed 712.8px of actual progress. Pause works. Manual wheel input restores the Auto-scroll button (off state).
- RSVP attendance submitted with three seats; the guest manager displayed the updated three seats and aggregate. Restored the seed guest to two seats after the check.
- Created a disposable guest, searched, copied a unique UUID-token URL, edited the name, and deleted the test guest. Single-link clipboard content is a plain URL. Bulk copying two selected attending guests produced two correctly labeled personalized URLs.
- Invalid guest token shows the explicit invitation-not-found view.
- Studio and guest story have no document-level horizontal overflow at 375, 390, 430 and 768px. Desktop studio checked at 1440px; final bounds checked at 1280px. Mobile cover/first reveal visually inspected at 390px.
- No captured browser console errors or warnings during the checked interactions.

## Limits

- Reduced-motion behavior is implemented in Motion hooks and CSS; a real OS reduced-motion toggle was not exercised.
- Real iOS Safari / Android Chrome audio, touch cancellation and performance traces remain unverified. These desktop browser checks do not establish mobile FPS or device-level smoothness.
- File-upload controls are implemented with local FileReader storage and size limits; real-device file selection and storage quota exhaustion were not exercised end to end.
- No cross-device persistence, remote RSVP delivery or Supabase connection is claimed. Everything is a local demo.

Full-page browser captures showed stitching artifacts on sticky/fixed content; layout bounds and DOM instance counts were checked separately. Normal mobile viewport captures were used for visual review.
