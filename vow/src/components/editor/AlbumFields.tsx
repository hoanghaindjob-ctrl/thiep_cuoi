import Image from "next/image";
import type { EditorFieldsProps } from "./fieldTypes";
import { Field } from "./Field";
import { Icon } from "@/components/ui/Icon";
import { GiftFields } from "./GiftFields";

export function AlbumFields({ data, update, upload }: EditorFieldsProps) {
  return (
    <>
      <div className="mini-heading">
        <h3>Album ảnh</h3>
        <Icon name="image" />
      </div>
      <p className="field-note">
        Băng ảnh tự chuyển sau mỗi 4 giây. Càng nhiều ảnh thì hai bên càng đầy —
        từ 5 ảnh trở lên là đẹp nhất.
      </p>
      <div className="gallery-editor">
        {data.gallery.map((item) => (
          <div key={item.id}>
            <Image
              src={item.src}
              width={160}
              height={180}
              alt={item.alt}
              unoptimized
            />
            <button
              aria-label={`Xoá ảnh ${item.alt}`}
              onClick={() =>
                update({
                  gallery: data.gallery.filter((g) => g.id !== item.id),
                })
              }
            >
              <Icon name="close" size={14} />
            </button>
          </div>
        ))}
        <label className="add-photo">
          <Icon name="plus" />
          Thêm ảnh
          <input
            type="file"
            accept="image/*"
            onChange={(e) => upload(e.target.files?.[0], "gallery")}
          />
        </label>
      </div>
      {data.gallery.map((item, i) => (
        <div className="field-grid" key={item.id}>
          <Field
            wide
            label={`Chú thích ảnh ${i + 1}`}
            value={item.caption}
            onChange={(caption) =>
              update({
                gallery: data.gallery.map((g) =>
                  g.id === item.id ? { ...g, caption } : g,
                ),
              })
            }
          />
        </div>
      ))}

      <div className="form-divider" />
      <div className="mini-heading">
        <h3>Nhạc nền</h3>
        <Icon name="music" />
      </div>
      <div className="field-grid">
        <Field
          wide
          label="Liên kết nhạc"
          type="url"
          value={data.music.startsWith("data:") ? "" : data.music}
          onChange={(music) => update({ music })}
          placeholder="https://..."
          hint="Dán link file mp3. Cách này không bị giới hạn 3 MB như khi tải lên."
        />
      </div>
      <div className="music-setting">
        <Icon name="music" />
        <div>
          <strong>Tệp đang dùng</strong>
          <small>
            {data.music.startsWith("data:")
              ? "Tệp bạn đã tải lên"
              : data.music || "Chưa có nhạc"}
          </small>
        </div>
        <label className="text-button">
          Tải lên
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => upload(e.target.files?.[0], "music")}
          />
        </label>
      </div>
      {data.music && (
        <audio controls src={data.music} className="audio-preview" />
      )}

      <GiftFields data={data} update={update} />

      <div className="form-divider" />
      <div className="mini-heading">
        <h3>Phần nào hiện trên thiệp</h3>
        <Icon name="eye" />
      </div>
      {data.sections.map((s) => (
        <label className="section-toggle" key={s.id}>
          <span>
            {s.id === "0"
              ? data.ceremonyType === "vu-quy"
                ? "Lễ vu quy"
                : "Lễ thành hôn"
              : s.title}
          </span>
          <input
            type="checkbox"
            checked={s.enabled}
            onChange={() =>
              update({
                sections: data.sections.map((x) =>
                  x.id === s.id ? { ...x, enabled: !x.enabled } : x,
                ),
              })
            }
          />
        </label>
      ))}
    </>
  );
}
