-- Thiệp cưới — cấu trúc cơ sở dữ liệu (migration khởi tạo)
--
-- Áp dụng bằng Supabase CLI (`supabase db push`) hoặc dán nguyên file vào
-- Supabase → SQL Editor. Dữ liệu mẫu nằm riêng ở ../seed.sql.
--
-- Vì sao nội dung thiệp là một cột jsonb chứ không tách thành nhiều bảng:
-- thiệp luôn được đọc trọn vẹn và lưu trọn vẹn trong một lần bấm "Lưu thay
-- đổi", không có truy vấn nào cần lọc theo từng mốc lịch trình hay từng ảnh.
-- Tách ra thành bảng timeline/gallery/families/sections chỉ thêm 4 lần join
-- cho đúng một hàng, và mỗi lần đổi bố cục thiệp lại phải viết migration.
-- Khách mời thì ngược lại: được tra theo token, lọc theo nhóm và đếm, nên là
-- một bảng thật với các cột thật.

create extension if not exists "pgcrypto";

create table if not exists public.invitations (
  slug        text primary key,
  data        jsonb       not null,
  updated_at  timestamptz not null default now()
);

create table if not exists public.guests (
  token           text primary key,
  invitation_slug text not null references public.invitations(slug) on delete cascade,
  name            text not null,
  contact         text not null default '',
  "group"         text not null default '',
  attendees       integer not null default 1 check (attendees between 0 and 50),
  message         text not null default '',
  -- Thiệp hiện không có ô xác nhận; cột này giữ chỗ cho lúc bật lại.
  status          text not null default 'Awaiting reply',
  created_at      timestamptz not null default now()
);

create index if not exists guests_invitation_slug_idx
  on public.guests (invitation_slug);

-- Bật RLS và KHÔNG tạo policy nào.
--
-- Toàn bộ truy cập đi qua route handler của Next bằng service role key — key
-- đó bỏ qua RLS và không bao giờ rời khỏi máy chủ. Không có policy nghĩa là
-- anon key (nếu lỡ lộ ra trình duyệt) không đọc hay ghi được gì cả.
alter table public.invitations enable row level security;
alter table public.guests      enable row level security;
