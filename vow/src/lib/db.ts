import { invitation as seedInvitation } from "@/mocks/invitation";
import { guests as seedGuests } from "@/mocks/guests";
import type { CeremonyContent, Guest, Invitation } from "@/types/invitation";
import { supabase, supabaseConfigured } from "./supabase";

/**
 * The one place that talks to storage.
 *
 * With Supabase configured it is the only path. Without it, the app falls back
 * to an in-process copy of the seed data so the whole async flow — routes,
 * login, editor, guest page — can still be run and tested locally before any
 * credentials exist. The fallback lives in server memory and resets when the
 * server restarts; it is a development convenience, not a store.
 */
const SLUG = seedInvitation.slug;

/**
 * Pinned to globalThis, not a module constant: Next compiles route handlers and
 * server components into separate module graphs, so a plain module-level object
 * gets instantiated twice and a write through the API would be invisible to the
 * page that renders the invitation.
 */
declare global {
  var __vowFallback: { invitation: Invitation; guests: Guest[] } | undefined;
}

const memory = (globalThis.__vowFallback ??= {
  invitation: structuredClone(seedInvitation) as Invitation,
  guests: structuredClone(seedGuests) as Guest[],
});

export const usingFallback = !supabaseConfigured;

/** Selects the complete ceremony-specific content while retaining shared media. */
export function withCeremonyType(
  invitation: Invitation,
  ceremonyType: Invitation["ceremonyType"],
): Invitation {
  const content = invitation.ceremonyContent?.[ceremonyType];
  if (!content) {
    return { ...invitation, ceremonyType };
  }
  return {
    ...invitation,
    ...structuredClone(content),
    ceremonyType,
    ceremonyEvent: {
      ...invitation.ceremonyEvent,
      [ceremonyType]: structuredClone(content.event),
    },
    ceremonyText: {
      ...invitation.ceremonyText,
      [ceremonyType]: structuredClone(
        content.ceremonyText ?? invitation.ceremonyText?.[ceremonyType],
      ),
    },
  };
}

/**
 * Rows written before a field existed come back missing it. Fill every gap
 * from the seed so a saved invitation never renders `undefined`.
 */
function normalise(stored: Partial<Invitation>): Invitation {
  const seed = seedInvitation;
  const ceremonyType: Invitation["ceremonyType"] =
    stored.ceremonyType === "vu-quy" ? "vu-quy" : "thanh-hon";

  const legacyEvent = { ...seed.event, ...stored.event };

  const normaliseCeremony = (
    cType: Invitation["ceremonyType"],
  ): CeremonyContent => {
    const seedContent = seed.ceremonyContent[cType];
    const storedContent = stored.ceremonyContent?.[cType];
    const isActive = cType === ceremonyType;

    const baseEvent =
      cType === "vu-quy"
        ? seed.ceremonyEvent["vu-quy"]
        : { ...seed.ceremonyEvent["thanh-hon"], ...legacyEvent };

    const event = {
      ...seedContent.event,
      ...baseEvent,
      ...(stored.ceremonyEvent?.[cType] ?? {}),
      ...(isActive && stored.event ? stored.event : {}),
      ...(storedContent?.event ?? {}),
    };

    const ceremonyText = {
      ...seedContent.ceremonyText,
      ...(stored.ceremonyText?.[cType] ?? {}),
      ...(storedContent?.ceremonyText ?? {}),
    };

    const families = {
      groom: {
        ...seedContent.families.groom,
        ...(storedContent?.families?.groom ??
          (isActive ? stored.families?.groom : {})),
      },
      bride: {
        ...seedContent.families.bride,
        ...(storedContent?.families?.bride ??
          (isActive ? stored.families?.bride : {})),
      },
    };

    const gift = {
      note:
        storedContent?.gift?.note ??
        (isActive ? stored.gift?.note : undefined) ??
        seedContent.gift.note,
      accounts:
        storedContent?.gift?.accounts ??
        (isActive ? stored.gift?.accounts : undefined) ??
        structuredClone(seedContent.gift.accounts),
    };

    const timeline =
      storedContent?.timeline ??
      (isActive ? stored.timeline : undefined) ??
      structuredClone(seedContent.timeline);

    const sections =
      storedContent?.sections ??
      (isActive ? stored.sections : undefined) ??
      structuredClone(seedContent.sections);

    return {
      title: storedContent?.title ?? stored.title ?? seedContent.title,
      bride: storedContent?.bride ?? stored.bride ?? seedContent.bride,
      groom: storedContent?.groom ?? stored.groom ?? seedContent.groom,
      introduction:
        storedContent?.introduction ??
        stored.introduction ??
        seedContent.introduction,
      message:
        storedContent?.message ??
        (isActive ? stored.message : undefined) ??
        seedContent.message,
      story: storedContent?.story ?? stored.story ?? seedContent.story,
      event,
      families,
      gift,
      timeline,
      sections,
      ceremonyText,
    };
  };

  const ceremonyContent = {
    "thanh-hon": normaliseCeremony("thanh-hon"),
    "vu-quy": normaliseCeremony("vu-quy"),
  };

  const active = ceremonyContent[ceremonyType];

  return {
    ...seed,
    ...stored,
    ceremonyType,
    ceremonyContent,
    ...active,
    ceremonyEvent: {
      "thanh-hon": structuredClone(ceremonyContent["thanh-hon"].event),
      "vu-quy": structuredClone(ceremonyContent["vu-quy"].event),
    },
    ceremonyText: {
      "thanh-hon": structuredClone(ceremonyContent["thanh-hon"].ceremonyText),
      "vu-quy": structuredClone(ceremonyContent["vu-quy"].ceremonyText),
    },
    gallery: stored.gallery ?? structuredClone(seed.gallery),
    music: stored.music ?? seed.music,
    hero: stored.hero ?? seed.hero,
    groomPhoto: stored.groomPhoto ?? seed.groomPhoto,
    bridePhoto: stored.bridePhoto ?? seed.bridePhoto,
  };
}

interface GuestRow {
  token: string;
  ceremony_type: Invitation["ceremonyType"] | null;
  name: string;
  contact: string | null;
  group: string | null;
  attendees: number | null;
  message: string | null;
  status: string | null;
}

function toGuest(row: GuestRow): Guest {
  return {
    token: row.token,
    ceremonyType:
      row.ceremony_type === "vu-quy" ? "vu-quy" : "thanh-hon",
    name: row.name,
    contact: row.contact ?? "",
    group: row.group ?? "",
    attendees: row.attendees ?? 1,
    message: row.message ?? "",
    status: (row.status as Guest["status"]) ?? "Awaiting reply",
  };
}

export async function getInvitation(slug = SLUG): Promise<Invitation | null> {
  if (usingFallback) {
    return memory.invitation.slug === slug ? normalise(memory.invitation) : null;
  }
  const { data, error } = await supabase()
    .from("invitations")
    .select("data")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? normalise(data.data as Partial<Invitation>) : null;
}

export async function saveInvitation(value: Invitation): Promise<void> {
  if (usingFallback) {
    memory.invitation = structuredClone(value);
    return;
  }
  const { error } = await supabase()
    .from("invitations")
    .upsert(
      { slug: value.slug, data: value, updated_at: new Date().toISOString() },
      { onConflict: "slug" },
    );
  if (error) throw new Error(error.message);
}

export async function listGuests(slug = SLUG): Promise<Guest[]> {
  if (usingFallback) return structuredClone(memory.guests);
  const { data, error } = await supabase()
    .from("guests")
    .select("token, ceremony_type, name, contact, group, attendees, message, status")
    .eq("invitation_slug", slug)
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return (data as GuestRow[]).map(toGuest);
}

/** Reads exactly one guest, so a shared link never exposes the rest of the list. */
export async function getGuest(
  slug: string,
  token: string,
): Promise<Guest | null> {
  if (usingFallback) {
    return memory.guests.find((g) => g.token === token) ?? null;
  }
  const { data, error } = await supabase()
    .from("guests")
    .select("token, ceremony_type, name, contact, group, attendees, message, status")
    .eq("invitation_slug", slug)
    .eq("token", token)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? toGuest(data as GuestRow) : null;
}

/**
 * The guest list is edited as a whole in the studio, so saving it replaces the
 * set: rows the editor no longer holds are deleted, the rest are upserted.
 */
export async function saveGuests(
  value: Guest[],
  slug = SLUG,
): Promise<void> {
  if (usingFallback) {
    memory.guests = structuredClone(value);
    return;
  }
  const db = supabase();
  const keep = value.map((g) => g.token);

  const remove = db.from("guests").delete().eq("invitation_slug", slug);
  const { error: delError } = keep.length
    ? await remove.not("token", "in", `(${keep.join(",")})`)
    : await remove;
  if (delError) throw new Error(delError.message);

  if (!value.length) return;
  const { error } = await db.from("guests").upsert(
    value.map((g) => ({
      token: g.token,
      ceremony_type: g.ceremonyType,
      invitation_slug: slug,
      name: g.name,
      contact: g.contact,
      group: g.group,
      attendees: g.attendees,
      message: g.message,
      status: g.status,
    })),
    { onConflict: "token" },
  );
  if (error) throw new Error(error.message);
}
