import type { CeremonyType } from "@/types/invitation";
import type { EditorFieldsProps } from "./fieldTypes";
import { Field } from "./Field";
import { Icon } from "@/components/ui/Icon";

export function PartyFields({ data, update, event }: EditorFieldsProps) {
  void event;
  const suaMoc = (id: string, patch: Partial<(typeof data.timeline)[number]>) =>
    update({
      timeline: data.timeline.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    });

  const capNhatSuKien = (
    ceremonyType: CeremonyType,
    patch: Partial<(typeof data.ceremonyEvent)[CeremonyType]>,
  ) => {
    // Use the latest state for every keystroke. This is important for Vu Quy:
    // rapid input events must not rebuild the object from a stale render and
    // accidentally restore the default ceremony values.
    update((current) => ({
      ceremonyEvent: {
        ...current.ceremonyEvent,
        [ceremonyType]: { ...current.ceremonyEvent[ceremonyType], ...patch },
      },
    }));
  };

  return (
    <>
      <div className="field-grid">
        <Field
          wide
          type="textarea"
          label="Lời mời"
          value={data.message}
          onChange={(message) => update({ message })}
          hint="Đoạn văn ngắn ở đầu thẻ “Thông tin tiệc cưới”."
        />
      </div>

      <div className="form-divider" />
      <div className="mini-heading">
        <h3>Lễ thành hôn</h3>
        <Icon name="pin" />
      </div>
      <p className="field-note">
        Cài đặt ngày giờ và địa điểm cho bản thiệp “Lễ thành hôn”.
      </p>
      <div className="field-grid">
        <Field
          label="Ngày cưới"
          type="date"
          value={data.ceremonyEvent["thanh-hon"].date}
          onChange={(v) => capNhatSuKien("thanh-hon", { date: v })}
        />
        <Field
          label="Giờ đón khách"
          type="time"
          value={data.ceremonyEvent["thanh-hon"].time}
          onChange={(v) => capNhatSuKien("thanh-hon", { time: v })}
        />
      </div>
      <div className="field-grid">
        <Field
          wide
          label="Tên địa điểm"
          value={data.ceremonyEvent["thanh-hon"].venue}
          onChange={(v) => capNhatSuKien("thanh-hon", { venue: v })}
        />
        <Field
          wide
          label="Địa chỉ"
          value={data.ceremonyEvent["thanh-hon"].address}
          onChange={(v) => capNhatSuKien("thanh-hon", { address: v })}
          hint="Bản đồ nhúng trên thiệp tìm theo tên địa điểm và địa chỉ này."
        />
        <Field
          wide
          label="Liên kết Google Maps"
          type="url"
          value={data.ceremonyEvent["thanh-hon"].mapsUrl}
          onChange={(v) => capNhatSuKien("thanh-hon", { mapsUrl: v })}
          hint="Dùng cho nút “Chỉ đường”. Để trống thì nút sẽ ẩn."
        />
      </div>

      <div className="form-divider" />
      <div className="mini-heading">
        <h3>Lễ vu quy</h3>
        <Icon name="pin" />
      </div>
      <p className="field-note">
        Cài đặt ngày giờ và địa điểm cho bản thiệp “Lễ vu quy”.
      </p>
      <div className="field-grid">
        <Field
          label="Ngày cưới"
          type="date"
          value={data.ceremonyEvent["vu-quy"].date}
          onChange={(v) => capNhatSuKien("vu-quy", { date: v })}
        />
        <Field
          label="Giờ đón khách"
          type="time"
          value={data.ceremonyEvent["vu-quy"].time}
          onChange={(v) => capNhatSuKien("vu-quy", { time: v })}
        />
      </div>
      <div className="field-grid">
        <Field
          wide
          label="Tên địa điểm"
          value={data.ceremonyEvent["vu-quy"].venue}
          onChange={(v) => capNhatSuKien("vu-quy", { venue: v })}
        />
        <Field
          wide
          label="Địa chỉ"
          value={data.ceremonyEvent["vu-quy"].address}
          onChange={(v) => capNhatSuKien("vu-quy", { address: v })}
          hint="Bản đồ nhúng trên thiệp tìm theo tên địa điểm và địa chỉ này."
        />
        <Field
          wide
          label="Liên kết Google Maps"
          type="url"
          value={data.ceremonyEvent["vu-quy"].mapsUrl}
          onChange={(v) => capNhatSuKien("vu-quy", { mapsUrl: v })}
          hint="Dùng cho nút “Chỉ đường”. Để trống thì nút sẽ ẩn."
        />
      </div>

      <div className="form-divider" />
      <div className="mini-heading">
        <h3>Lịch trình ngày cưới</h3>
        <Icon name="calendar" />
      </div>
      <p className="field-note">
        Mốc nào có chữ <strong>“Khai tiệc”</strong> sẽ được lấy làm giờ khai
        tiệc hiển thị ở thẻ tiệc cưới. Đổi tên mốc đó thì thiệp sẽ dùng lại giờ
        đón khách.
      </p>
      {data.timeline.map((item, i) => (
        <div className="timeline-editor" key={item.id}>
          <Field
            label="Giờ"
            type="time"
            value={item.time}
            onChange={(time) => suaMoc(item.id, { time })}
          />
          <Field
            label={`Mốc ${i + 1}`}
            value={item.title}
            onChange={(title) => suaMoc(item.id, { title })}
          />
          <Field
            wide
            label="Mô tả"
            value={item.description}
            onChange={(description) => suaMoc(item.id, { description })}
          />
          <button
            className="text-button"
            onClick={() =>
              update({
                timeline: data.timeline.filter((t) => t.id !== item.id),
              })
            }
          >
            Xoá mốc này
          </button>
        </div>
      ))}
      <button
        className="button"
        onClick={() =>
          update({
            timeline: [
              ...data.timeline,
              {
                id: crypto.randomUUID(),
                time: "20:00",
                title: "Mốc mới",
                description: "",
              },
            ],
          })
        }
      >
        <Icon name="plus" />
        Thêm mốc thời gian
      </button>
    </>
  );
}
