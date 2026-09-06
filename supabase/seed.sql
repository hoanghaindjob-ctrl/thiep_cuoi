-- Thiệp cưới — dữ liệu mẫu
--
-- Chạy sau migration, một lần, để có sẵn thiệp demo. `supabase db reset` tự
-- chạy file này ở môi trường local; với dự án thật thì dán vào SQL Editor
-- hoặc `psql "$DATABASE_URL" -f supabase/seed.sql`.
--
-- Sửa lại cho đúng đám cưới của bạn, hoặc bỏ qua rồi nhập từ trang studio.

insert into public.invitations (slug, data) values (
  'linh-and-minh',
  jsonb_build_object(
    'slug', 'linh-and-minh',
    'title', 'Về chung một nhà',
    'bride', 'Khánh Linh',
    'groom', 'Hoàng Minh',
    'introduction', 'Hai trái tim. Ngàn khoảnh khắc nhỏ. Một đời bên nhau.',
    'message', 'Có những niềm vui quá lớn để giữ riêng mình. Bằng tất cả thương mến, chúng mình mong được đón bạn trong ngày trọng đại.',
    'story', '',
    'hero', '/images/editorial.jpg',
    'groomPhoto', '/images/editorial.jpg',
    'bridePhoto', '/images/editorial.jpg',
    'music', 'https://pub-74f7a05c91d24898be33ce0896e6de16.r2.dev/Le%CC%82%CC%83%20%C4%90u%CC%9Bo%CC%9B%CC%80ng.mp3',
    'event', jsonb_build_object(
      'date', '2026-12-20',
      'time', '16:30',
      'venue', 'The Reverie Saigon',
      'address', '22–36 Nguyễn Huệ, Bến Nghé, Quận 1, TP. Hồ Chí Minh',
      'mapsUrl', 'https://www.google.com/maps/search/?api=1&query=The+Reverie+Saigon',
      'dressCode', '',
      'contact', ''
    ),
    'families', jsonb_build_object(
      'groom', jsonb_build_object('label','Nhà trai','father','Nguyễn Hoàng Đạt','mother','Lê Thị Thu Hà','address','Quận 3, TP. Hồ Chí Minh'),
      'bride', jsonb_build_object('label','Nhà gái','father','Trần Quang Vinh','mother','Phạm Thị Ngọc Lan','address','Quận Bình Thạnh, TP. Hồ Chí Minh')
    ),
    'gift', jsonb_build_object('note','','accounts', '[]'::jsonb),
    'gallery', jsonb_build_array(
      jsonb_build_object('id','one','src','/images/editorial.jpg','alt','Linh và Minh đi dạo trong khu vườn ngập nắng','caption','Thêm một bước gần hơn đến mãi mãi.'),
      jsonb_build_object('id','two','src','/images/details.jpg','alt','Lụa ngà và những chi tiết cưới trong nắng ấm','caption','Những điều nhỏ, mình đều nhớ.')
    ),
    'timeline', jsonb_build_array(
      jsonb_build_object('id','welcome','time','16:30','title','Đón khách','description','Mời bạn đến sớm, ngồi xuống và nâng ly cùng chúng mình.'),
      jsonb_build_object('id','vows','time','17:00','title','Nghi thức thành hôn','description','Chương mới bắt đầu, với bạn ở ngay bên cạnh.'),
      jsonb_build_object('id','dinner','time','18:00','title','Khai tiệc & lời chúc','description','Món ngon, lời thật lòng, và những người thương nhất.'),
      jsonb_build_object('id','dance','time','19:30','title','Tiệc ngọt dưới trời sao','description','Một chút khiêu vũ. Rất nhiều kỷ niệm.')
    ),
    'sections', jsonb_build_array(
      jsonb_build_object('id','0','title','Lễ thành hôn','enabled',true),
      jsonb_build_object('id','7','title','Ảnh cô dâu chú rể','enabled',true),
      jsonb_build_object('id','2','title','Thông tin tiệc cưới','enabled',true),
      jsonb_build_object('id','4','title','Album ảnh','enabled',true),
      jsonb_build_object('id','3','title','Lịch trình ngày cưới','enabled',true)
    )
  )
) on conflict (slug) do nothing;

insert into public.guests (token, invitation_slug, name, contact, "group", attendees, message) values
  ('k7Np4xQw9a', 'linh-and-minh', 'Anh & Tú',    'anh@example.com', 'Bạn bè',     2, 'Những chuyến đi vui nhất của tụi mình đều có bạn. Lần này cũng vậy.'),
  ('v2Rt8mLs3b', 'linh-and-minh', 'Mai Phương',  '',                'Gia đình',   1, 'Có chị ở đó, ngày vui của tụi em sẽ trọn vẹn hơn nhiều.'),
  ('c9Wy5hJd6e', 'linh-and-minh', 'Hoàng Nam',   '',                'Bạn bè',     2, 'Đến vì nghi thức, ở lại vì sàn nhảy nhé.'),
  ('a3Fm7pUz2s', 'linh-and-minh', 'Ngọc Anh',    '',                'Đồng nghiệp',1, 'Chúng mình rất mong được chia sẻ ngày đặc biệt này cùng bạn.'),
  ('b6Kq2nHv8t', 'linh-and-minh', 'Thảo & Huy',  '',                'Gia đình',   2, 'Dù thế nào, anh chị vẫn luôn là một phần trong câu chuyện của tụi em.')
on conflict (token) do nothing;
