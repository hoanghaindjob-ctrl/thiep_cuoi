import type { EditorFieldsProps } from "./fieldTypes";
import { Field } from "./Field";
import { Icon } from "@/components/ui/Icon";

export function PartyFields({ data, update, event }: EditorFieldsProps) {
  const suaMoc = (id: string, patch: Partial<(typeof data.timeline)[number]>) =>
    update({
      timeline: data.timeline.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    });

  return (
    <>
      <div className="field-grid">
        <Field
          label="Ngày cưới"
          type="date"
          value={data.event.date}
          onChange={(v) => event("date", v)}
          hint="Ngày âm lịch được tự tính từ ngày này."
        />
        <Field
          label="Giờ đón khách"
          type="time"
          value={data.event.time}
          onChange={(v) => event("time", v)}
        />
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
        <h3>Địa điểm</h3>
        <Icon name="pin" />
      </div>
      <div className="field-grid">
        <Field
          wide
          label="Tên địa điểm"
          value={data.event.venue}
          onChange={(v) => event("venue", v)}
        />
        <Field
          wide
          label="Địa chỉ"
          value={data.event.address}
          onChange={(v) => event("address", v)}
          hint="Bản đồ nhúng trên thiệp tìm theo tên địa điểm và địa chỉ này."
        />
        <Field
          wide
          label="Liên kết Google Maps"
          type="url"
          value={data.event.mapsUrl}
          onChange={(v) => event("mapsUrl", v)}
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
