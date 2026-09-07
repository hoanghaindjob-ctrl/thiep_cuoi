import { NextResponse } from "next/server";
import { getInvitation, saveInvitation } from "@/lib/db";
import type { Invitation } from "@/types/invitation";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json({ data: await getInvitation() });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Lỗi không xác định." },
      { status: 500 },
    );
  }
}

/** Enough of a shape check that a malformed save cannot blank the invitation. */
function looksLikeInvitation(v: unknown): v is Invitation {
  if (!v || typeof v !== "object") return false;
  const i = v as Partial<Invitation>;
  const ceremonyEvent = i.ceremonyEvent as
    | {
        [key: string]: Partial<{
          date: string;
          time: string;
          venue: string;
          address: string;
          mapsUrl: string;
          dressCode: string;
          contact: string;
        }>;
      }
    | undefined;
  const ceremonyText = i.ceremonyText as
    | {
        [key: string]: Partial<{
          announcementLine: string;
          noticeLine: string;
          venueLine: string;
        }>;
      }
    | undefined;
  const okCeremonyText =
    ceremonyText === undefined ||
    (typeof ceremonyText === "object" &&
      ceremonyText !== null &&
      typeof ceremonyText["thanh-hon"]?.announcementLine === "string" &&
      typeof ceremonyText["thanh-hon"]?.noticeLine === "string" &&
      typeof ceremonyText["thanh-hon"]?.venueLine === "string" &&
      typeof ceremonyText["vu-quy"]?.announcementLine === "string" &&
      typeof ceremonyText["vu-quy"]?.noticeLine === "string" &&
      typeof ceremonyText["vu-quy"]?.venueLine === "string");
  const okCeremonyEvent =
    ceremonyEvent === undefined ||
    (typeof ceremonyEvent === "object" &&
      ceremonyEvent !== null &&
      typeof ceremonyEvent["thanh-hon"]?.date === "string" &&
      typeof ceremonyEvent["thanh-hon"]?.time === "string" &&
      typeof ceremonyEvent["thanh-hon"]?.venue === "string" &&
      typeof ceremonyEvent["thanh-hon"]?.address === "string" &&
      typeof ceremonyEvent["vu-quy"]?.date === "string" &&
      typeof ceremonyEvent["vu-quy"]?.time === "string" &&
      typeof ceremonyEvent["vu-quy"]?.venue === "string" &&
      typeof ceremonyEvent["vu-quy"]?.address === "string");
  return (
    typeof i.slug === "string" &&
    i.slug.length > 0 &&
    (i.ceremonyType === "thanh-hon" || i.ceremonyType === "vu-quy") &&
    okCeremonyText &&
    okCeremonyEvent &&
    typeof i.bride === "string" &&
    typeof i.groom === "string" &&
    typeof i.event === "object" &&
    i.event !== null &&
    Array.isArray(i.timeline) &&
    Array.isArray(i.gallery) &&
    Array.isArray(i.sections)
  );
}

export async function PUT(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON không hợp lệ." }, { status: 400 });
  }
  if (!looksLikeInvitation(body)) {
    return NextResponse.json(
      { error: "Dữ liệu thiệp thiếu trường bắt buộc." },
      { status: 400 },
    );
  }
  try {
    await saveInvitation(body);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Không lưu được." },
      { status: 500 },
    );
  }
}
