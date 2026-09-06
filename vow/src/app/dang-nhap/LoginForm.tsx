"use client";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";

export function LoginForm({ next }: { next: string }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  return (
    <main className="dang-nhap">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setError("");
          try {
            const res = await fetch("/api/dang-nhap", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ password }),
            });
            if (res.ok) {
              window.location.href = next;
              return;
            }
            const body = (await res.json()) as { error?: string };
            setError(body.error ?? "Không đăng nhập được.");
          } catch {
            setError("Không kết nối được máy chủ.");
          }
          setBusy(false);
        }}
      >
        <span className="brand">
          vow<span>®</span>
        </span>
        <h1>Trang quản lý thiệp</h1>
        <p>Nhập mật khẩu để sửa nội dung thiệp và xem danh sách khách.</p>
        <label className="field wide">
          <span>Mật khẩu</span>
          <input
            type="password"
            autoFocus
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {error && (
          <p className="dang-nhap-loi" role="alert">
            {error}
          </p>
        )}
        <button className="button dark" disabled={busy || !password}>
          <Icon name="check" size={16} />
          {busy ? "Đang kiểm tra…" : "Vào trang quản lý"}
        </button>
      </form>
    </main>
  );
}
