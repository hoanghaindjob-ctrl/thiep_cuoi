import type { EditorFieldsProps } from "./fieldTypes";
import { Field } from "./Field";
import { Icon } from "@/components/ui/Icon";
import type { GiftAccount } from "@/types/invitation";

export function GiftFields({
  data,
  update,
}: Pick<EditorFieldsProps, "data" | "update">) {
  const updateGift = (patch: Partial<typeof data.gift>) =>
    update({ gift: { ...data.gift, ...patch } });

  const updateAccount = (id: string, patch: Partial<GiftAccount>) =>
    updateGift({
      accounts: data.gift.accounts.map((account) =>
        account.id === id ? { ...account, ...patch } : account,
      ),
    });

  return (
    <>
      <div className="form-divider" />
      <div className="mini-heading">
        <h3>Thông tin mừng cưới</h3>
        <Icon name="gift" />
      </div>
      <div className="field-grid">
        <Field
          wide
          type="textarea"
          label="Lời nhắn"
          value={data.gift.note}
          onChange={(note) => updateGift({ note })}
          hint="Hiển thị phía trên danh sách tài khoản trên thiệp."
        />
      </div>

      {data.gift.accounts.map((account, index) => (
        <div className="gift-account-editor" key={account.id}>
          <div className="mini-heading">
            <h3>Tài khoản {index + 1}</h3>
            <button
              type="button"
              className="text-button"
              onClick={() =>
                updateGift({
                  accounts: data.gift.accounts.filter((x) => x.id !== account.id),
                })
              }
            >
              Xoá
            </button>
          </div>
          <div className="field-grid">
            <Field
              label="Bên gia đình"
              value={account.side}
              onChange={(side) => updateAccount(account.id, { side })}
              placeholder="Nhà trai"
            />
            <Field
              label="Ngân hàng"
              value={account.bank}
              onChange={(bank) => updateAccount(account.id, { bank })}
              placeholder="Vietcombank"
            />
            <Field
              wide
              label="Chủ tài khoản"
              value={account.holder}
              onChange={(holder) => updateAccount(account.id, { holder })}
              placeholder="NGUYEN VAN A"
            />
            <Field
              wide
              label="Số tài khoản"
              value={account.number}
              onChange={(number) => updateAccount(account.id, { number })}
              placeholder="0123456789"
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        className="button"
        onClick={() =>
          updateGift({
            accounts: [
              ...data.gift.accounts,
              {
                id: crypto.randomUUID(),
                side: "Nhà trai",
                holder: "",
                bank: "",
                number: "",
                qr: "",
              },
            ],
          })
        }
      >
        <Icon name="plus" />
        Thêm tài khoản
      </button>
    </>
  );
}
