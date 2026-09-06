/**
 * Formatting helpers shared by the studio and the invitation.
 *
 * Reading and writing now lives in `src/lib/db.ts`, server-side. Nothing here
 * touches storage, so both server and client components can import it.
 */
export function guestPath(slug: string, token: string) {
  return `/i/${encodeURIComponent(slug)}/${encodeURIComponent(token)}`;
}

export function formatDate(
  date: string,
  options?: Intl.DateTimeFormatOptions,
  locale = "vi-VN",
) {
  const value = new Date(date + "T12:00:00");
  return Number.isNaN(value.getTime())
    ? "Ngày cưới của bạn"
    : value.toLocaleDateString(
        locale,
        options ?? { day: "numeric", month: "long", year: "numeric" },
      );
}
