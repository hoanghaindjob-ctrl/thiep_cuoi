import Link from "next/link";
import { GuestExperience } from "@/components/invitation/GuestExperience";
import { getGuest, getInvitation } from "@/lib/db";

export const metadata = {
  title: "Thiệp mời · Vow",
  robots: { index: false, follow: false },
};

/** The invitation reflects whatever the studio saved a moment ago. */
export const dynamic = "force-dynamic";

export default async function InvitationPage({
  params,
  searchParams,
}: {
  params: Promise<{ "invitation-slug": string; "guest-token": string }>;
  searchParams: Promise<{ open?: string }>;
}) {
  const [p, q] = await Promise.all([params, searchParams]);
  const slug = p["invitation-slug"];
  const token = p["guest-token"];

  const [invitation, guest] = await Promise.all([
    getInvitation(slug),
    getGuest(slug, token),
  ]);

  if (!invitation || !guest) {
    return (
      <div className="dang-mo" lang="vi">
        <h1>Thiệp này đang chờ được tìm thấy.</h1>
        <p>Bạn kiểm tra lại đường dẫn riêng với gia chủ giúp nhé.</p>
        <Link href="/">Quay lại trang quản lý</Link>
      </div>
    );
  }

  return (
    <GuestExperience
      invitation={invitation}
      guest={guest}
      initialOpen={q.open === "1"}
    />
  );
}
