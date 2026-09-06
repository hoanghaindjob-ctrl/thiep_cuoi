import type { EditorFieldsProps } from "./fieldTypes";
import { Field } from "./Field";
import { Icon } from "@/components/ui/Icon";
import type { Families, FamilySide } from "@/types/invitation";

const BEN: { key: keyof Families; ten: string }[] = [
  { key: "groom", ten: "Nhà trai" },
  { key: "bride", ten: "Nhà gái" },
];

export function FamilyFields({ data, update }: EditorFieldsProps) {
  const doi = (ben: keyof Families, patch: Partial<FamilySide>) =>
    update({
      families: { ...data.families, [ben]: { ...data.families[ben], ...patch } },
    });

  return (
    <>
      <p className="field-note">
        Phần này in ở thẻ &ldquo;Thông tin lễ cưới&rdquo;, ngay trên dòng
        &ldquo;Trân trọng báo tin&rdquo;.
      </p>
      {BEN.map(({ key, ten }, i) => (
        <div key={key}>
          {i > 0 && <div className="form-divider" />}
          <div className="mini-heading">
            <h3>{ten}</h3>
            <Icon name="people" />
          </div>
          <div className="field-grid">
            <Field
              wide
              label="Tên hiển thị"
              value={data.families[key].label}
              onChange={(label) => doi(key, { label })}
              hint={`Chữ nhỏ phía trên tên cha mẹ, mặc định là "${ten}".`}
            />
            <Field
              label="Ông"
              value={data.families[key].father}
              onChange={(father) => doi(key, { father })}
              placeholder="Nguyễn Văn A"
            />
            <Field
              label="Bà"
              value={data.families[key].mother}
              onChange={(mother) => doi(key, { mother })}
              placeholder="Trần Thị B"
            />
            <Field
              wide
              label="Địa chỉ"
              value={data.families[key].address}
              onChange={(address) => doi(key, { address })}
              placeholder="Quận 1, TP. Hồ Chí Minh"
            />
          </div>
        </div>
      ))}
    </>
  );
}
