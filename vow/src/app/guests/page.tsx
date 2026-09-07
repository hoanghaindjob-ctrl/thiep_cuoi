import { StudioShell } from "@/components/editor/StudioShell";
import { GuestManager } from "@/components/editor/GuestManager";
import { getInvitation, listGuests } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function GuestsPage() {
  const [guests, invitation] = await Promise.all([listGuests(), getInvitation()]);
  return (
    <StudioShell active="guests">
      <GuestManager
        initialGuests={guests}
        slug={invitation?.slug ?? ""}
        defaultCeremonyType={invitation?.ceremonyType ?? "thanh-hon"}
      />
    </StudioShell>
  );
}
