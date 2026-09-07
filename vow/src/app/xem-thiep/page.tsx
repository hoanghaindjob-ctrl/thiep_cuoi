import Link from "next/link";
import { GuestExperience } from "@/components/invitation/GuestExperience";
import { getInvitation, withCeremonyType } from "@/lib/db";
import type { CeremonyType, Guest } from "@/types/invitation";

export const metadata = {
  title: "Xem trước thiệp · Vow",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const previewGuest: Guest = {
  token: "preview",
  ceremonyType: "thanh-hon",
  name: "Quý khách",
  contact: "",
  group: "Xem trước",
  attendees: 1,
  status: "Awaiting reply",
  message: "",
};

export default async function InvitationPreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; open?: string }>;
}) {
  const [invitation, sp] = await Promise.all([getInvitation(), searchParams]);
  if (!invitation) {
    return (
      <div className="dang-mo" lang="vi">
        <h1>Chưa có thiệp để xem trước.</h1>
        <Link href="/">Quay lại trang quản lý</Link>
      </div>
    );
  }

  const requestedType: CeremonyType =
    sp.type === "vu-quy"
      ? "vu-quy"
      : sp.type === "thanh-hon"
        ? "thanh-hon"
        : invitation.ceremonyType;

  return (
    <GuestExperience
      invitation={withCeremonyType(invitation, requestedType)}
      guest={{ ...previewGuest, ceremonyType: requestedType }}
      initialOpen={sp.open !== "0"}
    />
  );
}
