import Link from "next/link";
import { GuestExperience } from "@/components/invitation/GuestExperience";
import { getInvitation } from "@/lib/db";
import type { Guest } from "@/types/invitation";

export const metadata = {
  title: "Xem trước thiệp · Vow",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const previewGuest: Guest = {
  token: "preview",
  name: "Quý khách",
  contact: "",
  group: "Xem trước",
  attendees: 1,
  status: "Awaiting reply",
  message: "",
};

export default async function InvitationPreviewPage() {
  const invitation = await getInvitation();
  if (!invitation) {
    return (
      <div className="dang-mo" lang="vi">
        <h1>Chưa có thiệp để xem trước.</h1>
        <Link href="/">Quay lại trang quản lý</Link>
      </div>
    );
  }

  return (
    <GuestExperience
      invitation={invitation}
      guest={previewGuest}
      initialOpen
    />
  );
}
