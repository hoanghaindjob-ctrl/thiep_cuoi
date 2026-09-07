-- Mỗi khách có thể nhận bản Lễ thành hôn hoặc Lễ vu quy từ cùng một thiệp.
alter table public.guests
  add column if not exists ceremony_type text not null default 'thanh-hon';

alter table public.guests
  drop constraint if exists guests_ceremony_type_check;

alter table public.guests
  add constraint guests_ceremony_type_check
  check (ceremony_type in ('thanh-hon', 'vu-quy'));
