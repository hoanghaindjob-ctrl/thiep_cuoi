import Image from "next/image";
import type { CeremonyType, Invitation } from "@/types/invitation";
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
  const updateCeremonyText = (
    ceremonyType: CeremonyType,
    patch: Partial<Invitation["ceremonyText"][CeremonyType]>,
  ) => {
    update({
      ceremonyText: {
        ...data.ceremonyText,
        [ceremonyType]: {
          ...data.ceremonyText[ceremonyType],
          ...patch,
        },
      },
    });
  };

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
          hint="Đổi loại thiệp sẽ tự động nạp lại toàn bộ dữ liệu của loại đó."
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

      <div className="form-divider" />
      <div className="mini-heading">
        <h3>
          Dòng chữ nghi lễ (
          {data.ceremonyType === "vu-quy" ? "Lễ vu quy" : "Lễ thành hôn"})
        </h3>
        <Icon name="edit" />
      </div>
      <p className="field-note">
        Hiển thị ở đầu thiệp cho bản “
        {data.ceremonyType === "vu-quy" ? "Lễ vu quy" : "Lễ thành hôn"}”. Đổi
        loại thiệp ở trên để chỉnh cho bản khác.
      </p>

      <div className="field-grid">
        <Field
          wide
          label="Dòng báo tin"
          value={data.ceremonyText[data.ceremonyType]?.announcementLine ?? ""}
          onChange={(announcementLine) =>
            updateCeremonyText(data.ceremonyType, { announcementLine })
          }
          placeholder="Ví dụ: Trân trọng báo tin"
        />
        <Field
          wide
          label="Dòng lễ"
          value={data.ceremonyText[data.ceremonyType]?.noticeLine ?? ""}
          onChange={(noticeLine) =>
            updateCeremonyText(data.ceremonyType, { noticeLine })
          }
          placeholder={
            data.ceremonyType === "vu-quy"
              ? "Ví dụ: lễ vu quy của gia đình chúng tôi"
              : "Ví dụ: lễ thành hôn của con chúng tôi"
          }
        />
        <Field
          wide
          label="Dòng địa điểm"
          value={data.ceremonyText[data.ceremonyType]?.venueLine ?? ""}
          onChange={(venueLine) =>
            updateCeremonyText(data.ceremonyType, { venueLine })
          }
          placeholder={
            data.ceremonyType === "vu-quy"
              ? "Ví dụ: Lễ vu quy được cử hành tại"
              : "Ví dụ: Lễ thành hôn được cử hành tại"
          }
        />
      </div>
    </>
  );
}
