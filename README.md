# Thiệp cưới

Repo gồm hai phần rời nhau, deploy độc lập:

```
thiep_cuoi/
├── vow/            # Next.js — deploy lên Vercel
└── supabase/       # schema + dữ liệu mẫu — deploy lên Supabase
```

| Thư mục | Là gì | Đi đâu | Deploy bằng |
| --- | --- | --- | --- |
| [`vow/`](vow/) | Studio soạn thiệp + thiệp của khách | Vercel | `git push` (Root Directory = `vow`) |
| [`supabase/`](supabase/) | Bảng, index, RLS, dữ liệu mẫu | Supabase | `supabase db push` hoặc SQL Editor |

Hai phần chỉ dính nhau qua hai biến môi trường: `SUPABASE_URL` và
`SUPABASE_SERVICE_ROLE_KEY`. Frontend không biết gì về file SQL, hạ tầng không
biết gì về React — sửa bên nào cũng không phải deploy lại bên kia.

## Bắt đầu

**1. Dựng cơ sở dữ liệu.** Xem [`supabase/README.md`](supabase/README.md): tạo
dự án Supabase, chạy migration, nạp dữ liệu mẫu, rồi lấy hai key ở Project
Settings → API.

**2. Chạy frontend ở máy.**

```powershell
cd C:\Users\Lenovo\Desktop\thiep_cuoi\vow
npm install
Copy-Item .env.example .env.local   # điền STUDIO_PASSWORD + 2 key Supabase
npm run dev
```

Bỏ trống hai key Supabase thì app chạy bằng dữ liệu mẫu trong bộ nhớ máy chủ —
đủ để xem mọi màn hình, nhưng mất sạch khi khởi động lại. Chi tiết trong
[`vow/README.md`](vow/README.md).

## Deploy frontend lên Vercel

1. Import repo vào Vercel.
2. **Root Directory: `vow`** — bước quan trọng nhất. Không đặt, Vercel tìm
   `package.json` ở root và build hỏng; đặt rồi thì `supabase/` nằm ngoài
   build, không có file SQL nào lên tới Vercel.
3. Framework preset để nguyên **Next.js**; build command và output mặc định là
   đúng.
4. Environment Variables (Production + Preview + Development):

   | Biến | Giá trị |
   | --- | --- |
   | `STUDIO_PASSWORD` | Mật khẩu vào trang quản lý. Chưa đặt thì `/` và `/guests` trả 503. |
   | `SUPABASE_URL` | Project URL |
   | `SUPABASE_SERVICE_ROLE_KEY` | **service_role** key |

   Cả ba đều là biến phía máy chủ. Đừng thêm tiền tố `NEXT_PUBLIC_` cho bất kỳ
   biến nào — làm vậy là đẩy service role key vào bundle trình duyệt.
5. Deploy. Đổi env sau này phải redeploy mới có hiệu lực.

Thiệp của khách ở `/i/<slug>/<token>` luôn mở tự do, không cần đăng nhập —
đường link đó *chính là* tấm thiệp.

## Sửa mỗi bên

- **Chỉ đổi giao diện, nội dung, route:** làm trong `vow/`, push, Vercel tự
  build lại. Không đụng gì tới Supabase.
- **Đổi bảng/cột:** thêm migration mới trong `supabase/migrations/` rồi
  `supabase db push`. Đừng sửa migration đã chạy trên dự án thật.
