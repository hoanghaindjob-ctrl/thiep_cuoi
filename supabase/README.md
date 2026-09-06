# Hạ tầng — Supabase

Cơ sở dữ liệu của thiệp cưới. Thư mục này **không** được deploy lên Vercel:
Vercel chỉ build `vow/`. Ở đây chỉ có định nghĩa schema và dữ liệu mẫu, không
có bí mật nào — key nằm trong biến môi trường của Vercel và `vow/.env.local`.

```
supabase/
├── config.toml                       # cấu hình cho Supabase CLI
├── migrations/
│   └── 20260906000000_init.sql       # bảng invitations + guests, index, RLS
└── seed.sql                          # thiệp demo + 5 khách mời
```

## Áp dụng lên dự án Supabase

### Cách 1 — Supabase CLI (khuyến nghị)

```powershell
npm install -g supabase          # hoặc: scoop install supabase
cd C:\Users\Lenovo\Desktop\thiep_cuoi
supabase login
supabase link --project-ref <project-ref>   # ref lấy từ URL dashboard
supabase db push                            # chạy migrations/
```

`db push` chỉ chạy migration. Muốn có luôn thiệp demo thì thêm cờ `--include-seed`
— nó tự lấy `seed.sql` theo `sql_paths` khai trong `config.toml`:

```powershell
supabase db push --include-seed
```

Không dùng `supabase db execute` — lệnh đó không tồn tại. Cách khác nếu đã có
`psql` và chuỗi kết nối (Project Settings → Database):

```powershell
psql "$DATABASE_URL" -f supabase/seed.sql
```

### Cách 2 — SQL Editor trên dashboard

Dán `migrations/20260906000000_init.sql` rồi Run. Muốn có thiệp demo thì dán
tiếp `seed.sql`. Cả hai file đều chạy lại được nhiều lần mà không hỏng dữ liệu
(`if not exists`, `on conflict … do nothing`).

## Lấy key cho frontend

Supabase → Project Settings → API, rồi đặt vào Vercel (và `vow/.env.local` khi
chạy máy mình):

| Biến | Giá trị |
| --- | --- |
| `SUPABASE_URL` | Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | **service_role** key, không phải anon |

Dùng service role key vì mọi truy vấn đều chạy ở máy chủ và schema bật RLS mà
không tạo policy nào — anon key sẽ không đọc được gì. Tuyệt đối không đặt tiền
tố `NEXT_PUBLIC_` cho key này: làm vậy là nhúng thẳng quyền ghi vào bundle
trình duyệt.

## Đổi schema về sau

```powershell
supabase migration new them_cot_gi_do    # tạo file mới trong migrations/
# sửa file vừa tạo, rồi:
supabase db push
```

Đừng sửa migration đã chạy trên dự án thật — thêm file mới. Migration đầu tiên
chỉ là ảnh chụp trạng thái ban đầu, không phải nơi để chỉnh sửa dần.

## Ghi chú

- RLS bật trên cả hai bảng và **không có policy nào**. Đó là chủ ý: cửa duy
  nhất vào dữ liệu là route handler của Next với service role key.
- Ảnh và nhạc đang được nhúng thành data URI trong cột `jsonb` (giới hạn 3 MB
  mỗi file). Supabase Storage mới là chỗ đúng cho chúng — khi chuyển, bật
  `[storage]` trong `config.toml`.
- Chưa dùng Supabase Auth: studio đứng sau `STUDIO_PASSWORD`, còn thiệp của
  khách mở tự do bằng token trong đường dẫn.
