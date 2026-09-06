"use client";
import { useState } from "react";
import Link from "next/link";
import { guestPath } from "@/lib/repository";
import type { Invitation } from "@/types/invitation";
import { InvitationCover } from "@/components/invitation/InvitationCover";
import { Icon } from "@/components/ui/Icon";
import type { UploadTarget } from "./fieldTypes";
import { CoupleFields } from "./CoupleFields";
import { FamilyFields } from "./FamilyFields";
import { PartyFields } from "./PartyFields";
import { AlbumFields } from "./AlbumFields";
import { inspectImageUpload } from "@/lib/imageUpload";

/** Tabs follow the order the guest meets these blocks on the invitation. */
const TABS = [
  { ten: "Cặp đôi & ảnh", mo: "Tên, lời dẫn và ảnh của hai bạn." },
  { ten: "Hai bên gia đình", mo: "Tên cha mẹ và địa chỉ của nhà trai, nhà gái." },
  { ten: "Tiệc cưới", mo: "Ngày giờ, địa điểm và lịch trình trong ngày." },
  { ten: "Album & nhạc", mo: "Ảnh cưới, nhạc nền và phần nào hiện trên thiệp." },
];

const GIOI_HAN_MB = 3;

export function InvitationEditor({ initial }: { initial: Invitation }) {
  const [data, setData] = useState<Invitation>(initial);
  const [tab, setTab] = useState(0);
  const [saved, setSaved] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  const update = (patch: Partial<Invitation>) => {
    setData((d) => ({ ...d, ...patch }));
    setSaved(false);
  };
  const event = (key: keyof Invitation["event"], value: string) =>
    update({ event: { ...data.event, [key]: value } });

  async function save(): Promise<boolean> {
    setSaving(true);
    try {
      const res = await fetch("/api/invitation", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        setNotice(body.error ?? "Không lưu được thiệp.");
        return false;
      }
      setSaved(true);
      setNotice("Đã lưu thiệp.");
      return true;
    } catch {
      setNotice("Không kết nối được máy chủ.");
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function upload(file: File | undefined, target: UploadTarget) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setNotice("Tệp đã chọn không phải là ảnh.");
      return;
    }
    if (file.size > GIOI_HAN_MB * 1024 * 1024) {
      setNotice(
        `Tệp nặng hơn ${GIOI_HAN_MB} MB. Hãy dùng tệp nhẹ hơn, hoặc dán liên kết nếu là nhạc.`,
      );
      return;
    }

    try {
      await inspectImageUpload(file);
    } catch {
      setNotice("Không đọc được ảnh này. Hãy thử lại bằng tệp JPEG, PNG hoặc WebP.");
      return;
    }

    setNotice("Đang tải ảnh lên…");
    try {
      const form = new FormData();
      form.set("file", file);
      form.set("slug", data.slug);
      form.set("target", target);
      const response = await fetch("/api/images", { method: "POST", body: form });
      const body = (await response.json().catch(() => ({}))) as {
        url?: string;
        error?: string;
      };
      if (!response.ok || !body.url) {
        setNotice(body.error ?? "Không tải được ảnh.");
        return;
      }

      const src = body.url;
      if (target === "gallery") {
        update({
          gallery: [
            ...data.gallery,
            { id: crypto.randomUUID(), src, alt: file.name, caption: "" },
          ],
        });
      } else {
        update({ [target]: src });
      }
      setNotice("Đã tải ảnh. Nhấn “Lưu thay đổi” để hoàn tất.");
    } catch {
      setNotice("Không kết nối được máy chủ khi tải ảnh.");
    }
  }

  const previewUrl = guestPath(data.slug, "k7Np4xQw9a");
  const props = { data, update, event, upload };

  return (
    <main className="editor-main">
      <div className="page-heading">
        <div>
          <h1>Nội dung thiệp</h1>
          <p>Sửa ở đây, thiệp gửi khách sẽ đổi theo.</p>
        </div>
        <div className="heading-actions">
          <span className="save-status">
            <span className={saved ? "green-dot" : "unsaved-dot"} />
            {saved ? "Đã lưu" : "Chưa lưu"}
          </span>
          <button
            className="button dark"
            disabled={saving}
            onClick={() => void save()}
          >
            <Icon name="check" size={16} />
            {saving ? "Đang lưu…" : "Lưu thay đổi"}
          </button>
        </div>
      </div>

      <div className="editor-grid">
        <section className="form-area">
          <div className="editor-tabs" role="tablist" aria-label="Phần nội dung">
            {TABS.map((t, i) => (
              <button
                key={t.ten}
                role="tab"
                aria-selected={tab === i}
                className={tab === i ? "selected" : ""}
                onClick={() => setTab(i)}
              >
                {t.ten}
              </button>
            ))}
          </div>
          <div className="form-body">
            <div className="section-heading">
              <div>
                <h2>{TABS[tab].ten}</h2>
                <p>{TABS[tab].mo}</p>
              </div>
            </div>
            {tab === 0 && <CoupleFields {...props} />}
            {tab === 1 && <FamilyFields {...props} />}
            {tab === 2 && <PartyFields {...props} />}
            {tab === 3 && <AlbumFields {...props} />}
          </div>
          <div className="form-footer">
            <button
              className="text-button"
              disabled={saving}
              onClick={() => void save()}
            >
              <Icon name="check" size={15} />
              Lưu thay đổi
            </button>
            {tab < TABS.length - 1 && (
              <button className="text-button" onClick={() => setTab(tab + 1)}>
                {TABS[tab + 1].ten}
                <Icon name="arrow" size={16} />
              </button>
            )}
          </div>
        </section>

        <aside className="preview-area">
          <div className="preview-toolbar">
            <span>
              <span className="green-dot" />
              XEM TRƯỚC
            </span>
          </div>
          <div className="phone-frame">
            <div className="phone-island" />
            <InvitationCover
              invitation={data}
              guestName="Anh & Tú"
              preview
              onOpen={() => {
                // The guest page reads from the server, so it must be saved
                // before the new tab can show the change.
                void save().then((ok) => {
                  if (ok) window.open(previewUrl, "_blank", "noopener,noreferrer");
                });
              }}
            />
          </div>
          <p className="preview-caption">Bìa thiệp khách sẽ thấy đầu tiên.</p>
          <Link
            href={previewUrl}
            target="_blank"
            className="preview-link"
            onClick={() => void save()}
          >
            Xem toàn bộ thiệp <Icon name="arrow" size={15} />
          </Link>
        </aside>
      </div>

      {notice && (
        <div className="toast" role="status">
          {notice}
          <button aria-label="Đóng thông báo" onClick={() => setNotice("")}>
            <Icon name="close" size={16} />
          </button>
        </div>
      )}
    </main>
  );
}
