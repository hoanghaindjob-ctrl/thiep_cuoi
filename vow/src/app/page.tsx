import { StudioShell } from "@/components/editor/StudioShell";
import { InvitationEditor } from "@/components/editor/InvitationEditor";
import { getInvitation } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Home() {
  const invitation = await getInvitation();
  return (
    <StudioShell>
      {invitation ? (
        <InvitationEditor initial={invitation} />
      ) : (
        <main className="editor-main">
          <div className="page-heading">
            <div>
              <h1>Chưa có thiệp</h1>
              <p>
                Chưa tìm thấy thiệp nào trong cơ sở dữ liệu. Chạy{" "}
                <code>supabase/migrations/</code> rồi{" "}
                <code>supabase/seed.sql</code> trong Supabase để tạo bảng và dữ
                liệu mẫu.
              </p>
            </div>
          </div>
        </main>
      )}
    </StudioShell>
  );
}
