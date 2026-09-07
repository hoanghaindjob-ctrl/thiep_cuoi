import Image from "next/image";
import type { EditorFieldsProps, UploadTarget } from "./fieldTypes";
import { Field } from "./Field";
import { Icon } from "@/components/ui/Icon";

function AnhUpload({
  src,
  nhan,
  target,
  upload,
}: {
  src: string;
  nhan: string;
  target: UploadTarget;
  upload: EditorFieldsProps["upload"];
}) {
  return (
    <label className="photo-upload">
      <Image src={src} width={600} height={300} alt={nhan} unoptimized />
      <span>
        <Icon name="image" />
        {nhan}
      </span>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => upload(e.target.files?.[0], target)}
      />
    </label>
  );
}

export function CoupleFields({ data, update, upload }: EditorFieldsProps) {
  return (
    <>
      <div className="field-grid">
        <Field
          wide
          type="select"
          label="Loại thiệp"
          value={data.ceremonyType === "vu-quy" ? "Lễ vu quy" : "Lễ thành hôn"}
          options={["Lễ thành hôn", "Lễ vu quy"]}
          onChange={(value) =>
            update({ ceremonyType: value === "Lễ vu quy" ? "vu-quy" : "thanh-hon" })
          }
          hint="Thiệp dùng chung một mẫu; lựa chọn này chỉ đổi tên nghi lễ trong nội dung."
        />
        <Field
          label="Tên chú rể"
          value={data.groom}
          onChange={(groom) => update({ groom })}
          hint="Hiển thị ở bìa và các thẻ chính."
        />
        <Field
          label="Tên cô dâu"
          value={data.bride}
          onChange={(bride) => update({ bride })}
        />
        <Field
          wide
          label="Dòng chữ trên bìa"
          value={data.title}
          onChange={(title) => update({ title })}
          hint='Câu ngắn nằm dưới ngày cưới ở bìa thiệp, ví dụ "Về chung một nhà".'
        />
        <Field
          wide
          label="Lời dẫn mở đầu"
          value={data.introduction}
          onChange={(introduction) => update({ introduction })}
          hint="Nằm ngay dưới tên hai bạn ở đầu thiệp."
        />
      </div>

      <div className="form-divider" />
      <div className="mini-heading">
        <h3>Ảnh</h3>
        <Icon name="image" />
      </div>
      <AnhUpload
        src={data.hero}
        nhan="Đổi ảnh bìa"
        target="hero"
        upload={upload}
      />
      <p className="field-note">
        Ảnh bìa xuất hiện trong phong bì ở đầu thiệp và làm nền cho phần kết.
      </p>
      <div className="anh-doi">
        <AnhUpload
          src={data.groomPhoto}
          nhan="Đổi ảnh chú rể"
          target="groomPhoto"
          upload={upload}
        />
        <AnhUpload
          src={data.bridePhoto}
          nhan="Đổi ảnh cô dâu"
          target="bridePhoto"
          upload={upload}
        />
      </div>
    </>
  );
}
