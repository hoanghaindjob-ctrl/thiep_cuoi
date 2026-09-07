"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import type { Guest, Invitation } from "@/types/invitation";
import { guestPath } from "@/lib/repository";
import { Icon } from "@/components/ui/Icon";

const MOI_NHOM = "Mọi nhóm";
const GOI_Y_NHOM = ["Nhà trai", "Nhà gái", "Bạn bè", "Gia đình", "Đồng nghiệp"];

export function GuestManager({
  initialGuests,
  slug,
  defaultCeremonyType,
}: {
  initialGuests: Guest[];
  slug: string;
  defaultCeremonyType: Invitation["ceremonyType"];
}) {
  const [guests, setGuests] = useState<Guest[]>(initialGuests);
  const [search, setSearch] = useState("");
  const [group, setGroup] = useState<string>(MOI_NHOM);
  const [selected, setSelected] = useState<string[]>([]);
  const [removed, setRemoved] = useState<Guest[]>([]);
  const [editing, setEditing] = useState<Guest | null>(null);
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);

  // Someone may have edited the list in another tab.
  useEffect(() => {
    const refresh = async () => {
      try {
        const res = await fetch("/api/guests");
        if (!res.ok) return;
        const body = (await res.json()) as { data: Guest[] };
        setGuests(body.data);
      } catch {
        /* offline: keep what is on screen */
      }
    };
    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
  }, []);

  /** Writes the whole list, then keeps the server's answer as the truth. */
  async function persist(next: Guest[]): Promise<boolean> {
    setBusy(true);
    const previous = guests;
    setGuests(next);
    try {
      const res = await fetch("/api/guests", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(next),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        setGuests(previous);
        setNotice(body.error ?? "Không lưu được danh sách khách.");
        return false;
      }
      return true;
    } catch {
      setGuests(previous);
      setNotice("Không kết nối được máy chủ.");
      return false;
    } finally {
      setBusy(false);
    }
  }

  function edit(guest: Guest) {
    setEditing({ ...guest });
    dialog.current?.showModal();
  }

  async function copy(items: Guest[]) {
    try {
      await navigator.clipboard.writeText(
        items
          .map(
            (g) =>
              `${items.length > 1 ? g.name + ": " : ""}${location.origin}${guestPath(slug, g.token)}`,
          )
          .join("\n"),
      );
      setNotice(`Đã chép ${items.length} liên kết mời.`);
    } catch {
      setNotice("Không dùng được clipboard. Hãy mở thiệp rồi chép địa chỉ.");
    }
  }

  const nhomDaCo = [...new Set(guests.map((g) => g.group).filter(Boolean))];
  const visible = guests.filter(
    (g) =>
      g.name.toLowerCase().includes(search.trim().toLowerCase()) &&
      (group === MOI_NHOM || g.group === group),
  );
  // Keep the chosen group listed even if its last guest was just deleted,
  // so the dropdown never goes blank while still filtering.
  const nhomChon = [MOI_NHOM, ...nhomDaCo];
  if (group !== MOI_NHOM && !nhomChon.includes(group)) nhomChon.push(group);

  return (
    <main className="editor-main guest-manager">
      <div className="page-heading">
        <div>
          <h1>Khách mời</h1>
          <p>Mỗi khách có một liên kết thiệp riêng, mang đúng tên họ.</p>
        </div>
        <button
          className="button dark"
          onClick={() =>
            edit({
              token: crypto.randomUUID().replaceAll("-", ""),
              ceremonyType: defaultCeremonyType,
              name: "",
              contact: "",
              group: nhomDaCo[0] ?? "Bạn bè",
              attendees: 1,
              status: "Awaiting reply",
              message: "Rất mong được đón bạn trong ngày vui của chúng mình.",
            })
          }
        >
          <Icon name="plus" />
          Thêm khách
        </button>
      </div>

      <div className="guest-stats">
        <div>
          <span>Tổng số khách</span>
          <strong>{guests.length}</strong>
        </div>
        <div>
          <span>Tổng số chỗ</span>
          <strong>{guests.reduce((n, g) => n + g.attendees, 0)}</strong>
        </div>
      </div>

      <section className="guest-list">
        <div className="guest-list-toolbar">
          <label className="search-field">
            <Icon name="search" />
            <input
              placeholder="Tìm theo tên khách…"
              aria-label="Tìm khách"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
          <select
            aria-label="Lọc theo nhóm"
            value={group}
            onChange={(e) => setGroup(e.target.value)}
          >
            {nhomChon.map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
          <button
            className="button"
            disabled={!selected.length}
            onClick={() =>
              copy(guests.filter((g) => selected.includes(g.token)))
            }
          >
            <Icon name="copy" size={15} />
            {selected.length
              ? `Chép ${selected.length} liên kết`
              : "Chép liên kết"}
          </button>
        </div>

        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    aria-label="Chọn tất cả khách đang hiện"
                    checked={
                      visible.length > 0 &&
                      visible.every((g) => selected.includes(g.token))
                    }
                    onChange={(e) =>
                      setSelected(
                        e.target.checked ? visible.map((g) => g.token) : [],
                      )
                    }
                  />
                </th>
                <th>Khách mời</th>
                <th>Nhóm</th>
                <th>Loại thiệp</th>
                <th>Số chỗ</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((g) => (
                <tr key={g.token}>
                  <td>
                    <input
                      type="checkbox"
                      aria-label={`Chọn ${g.name}`}
                      checked={selected.includes(g.token)}
                      onChange={(e) =>
                        setSelected((s) =>
                          e.target.checked
                            ? [...s, g.token]
                            : s.filter((x) => x !== g.token),
                        )
                      }
                    />
                  </td>
                  <td>
                    <div className="guest-name">
                      <span className="avatar">{g.name[0]}</span>
                      <div>
                        <strong>{g.name}</strong>
                        {g.contact && <small>{g.contact}</small>}
                      </div>
                    </div>
                  </td>
                  <td>{g.group}</td>
                  <td>
                    {g.ceremonyType === "vu-quy" ? "Lễ vu quy" : "Lễ thành hôn"}
                  </td>
                  <td>{g.attendees}</td>
                  <td>
                    <div className="row-actions">
                      <Link
                        href={guestPath(slug, g.token)}
                        target="_blank"
                        aria-label={`Mở thiệp của ${g.name}`}
                      >
                        Mở ↗
                      </Link>
                      <button
                        aria-label={`Chép liên kết của ${g.name}`}
                        onClick={() => copy([g])}
                      >
                        <Icon name="copy" size={16} />
                      </button>
                      <button
                        aria-label={`Sửa ${g.name}`}
                        onClick={() => edit(g)}
                      >
                        <Icon name="edit" size={16} />
                      </button>
                      <button
                        aria-label={`Xoá ${g.name}`}
                        disabled={busy}
                        onClick={async () => {
                          if (
                            await persist(
                              guests.filter((x) => x.token !== g.token),
                            )
                          ) {
                            setRemoved((list) => [...list, g]);
                            setNotice(`Đã xoá ${g.name}. Bạn có thể hoàn tác.`);
                            setSelected((s) => s.filter((x) => x !== g.token));
                          }
                        }}
                      >
                        <Icon name="trash" size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!visible.length && (
            <div className="empty-state">
              {guests.length
                ? "Không có khách nào khớp với bộ lọc đang chọn."
                : "Chưa có khách nào. Bấm “Thêm khách” để bắt đầu."}
            </div>
          )}
        </div>

        {visible.length !== guests.length && (
          <div className="list-footer">
            <span>
              Đang hiện {visible.length} / {guests.length} khách
            </span>
          </div>
        )}
      </section>

      <dialog
        ref={dialog}
        onCancel={() => setEditing(null)}
        className="guest-dialog"
      >
        {editing && (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!editing.name.trim()) return;
              const exists = guests.some((g) => g.token === editing.token);
              const ok = await persist(
                exists
                  ? guests.map((g) => (g.token === editing.token ? editing : g))
                  : [...guests, editing],
              );
              if (ok) {
                dialog.current?.close();
                setEditing(null);
                setNotice("Đã lưu thông tin khách.");
              }
            }}
          >
            <div className="dialog-heading">
              <h2>Thông tin khách</h2>
              <button
                type="button"
                aria-label="Đóng"
                onClick={() => {
                  dialog.current?.close();
                  setEditing(null);
                }}
              >
                <Icon name="close" />
              </button>
            </div>
            <div className="field-grid">
              <label className="field wide">
                <span>Tên khách</span>
                <input
                  autoFocus
                  required
                  value={editing.name}
                  onChange={(e) =>
                    setEditing({ ...editing, name: e.target.value })
                  }
                />
                <small>Tên này in ngay trên bìa thiệp của họ.</small>
              </label>
              <label className="field wide">
                <span>Điện thoại hoặc email</span>
                <input
                  value={editing.contact}
                  onChange={(e) =>
                    setEditing({ ...editing, contact: e.target.value })
                  }
                />
              </label>
              <label className="field">
                <span>Nhóm</span>
                <input
                  list="nhom-khach"
                  value={editing.group}
                  onChange={(e) =>
                    setEditing({ ...editing, group: e.target.value })
                  }
                />
                <datalist id="nhom-khach">
                  {[...new Set([...GOI_Y_NHOM, ...nhomDaCo])].map((x) => (
                    <option key={x} value={x} />
                  ))}
                </datalist>
              </label>
              <label className="field">
                <span>Số chỗ</span>
                <input
                  type="number"
                  min={1}
                  max={10}
                  required
                  value={editing.attendees || 1}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      attendees: Number(e.target.value),
                    })
                  }
                />
              </label>
              <label className="field wide">
                <span>Loại thiệp</span>
                <select
                  value={editing.ceremonyType}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      ceremonyType: e.target.value as Guest["ceremonyType"],
                    })
                  }
                >
                  <option value="thanh-hon">Lễ thành hôn</option>
                  <option value="vu-quy">Lễ vu quy</option>
                </select>
                <small>Liên kết của khách sẽ hiển thị đúng loại nghi lễ này.</small>
              </label>
              <label className="field wide">
                <span>Lời nhắn riêng</span>
                <textarea
                  rows={3}
                  value={editing.message}
                  onChange={(e) =>
                    setEditing({ ...editing, message: e.target.value })
                  }
                />
                <small>Hiện chưa hiển thị trên thiệp.</small>
              </label>
            </div>
            <button className="button dark" type="submit" disabled={busy}>
              {busy ? "Đang lưu…" : "Lưu khách"} <Icon name="check" />
            </button>
          </form>
        )}
      </dialog>

      {notice && (
        <div className="toast" role="status">
          {notice}
          {removed.length > 0 && (
            <button
              onClick={async () => {
                if (await persist([...guests, ...removed])) {
                  setRemoved([]);
                  setNotice("Đã khôi phục khách vừa xoá.");
                }
              }}
            >
              Hoàn tác
            </button>
          )}
          <button aria-label="Đóng thông báo" onClick={() => setNotice("")}>
            <Icon name="close" size={16} />
          </button>
        </div>
      )}
    </main>
  );
}
