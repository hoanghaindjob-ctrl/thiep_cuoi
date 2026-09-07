import type { CeremonyType, Invitation } from "@/types/invitation";
const sharedInvitation = {
  slug: "linh-and-minh",
  ceremonyType: "thanh-hon" as CeremonyType,
  ceremonyText: {
    "thanh-hon": {
      announcementLine: "Trân trọng báo tin",
      noticeLine: "lễ thành hôn của con chúng tôi",
      venueLine: "Lễ thành hôn được cử hành tại",
    },
    "vu-quy": {
      announcementLine: "Trân trọng báo tin",
      noticeLine: "lễ vu quy của gia đình chúng tôi",
      venueLine: "Lễ vu quy được cử hành tại",
    },
  },
  ceremonyEvent: {
    "thanh-hon": {
      date: "2026-12-20",
      time: "16:30",
      venue: "The Reverie Saigon",
      address: "22–36 Nguyễn Huệ, Bến Nghé, Quận 1, TP. Hồ Chí Minh",
      mapsUrl:
        "https://www.google.com/maps/search/?api=1&query=The+Reverie+Saigon",
      dressCode: "Tông trung tính, một chút thanh lịch",
      contact: "+84 900 123 456",
    },
    "vu-quy": {
      date: "2026-12-20",
      time: "15:30",
      venue: "Nhà thờ Thánh Xavier",
      address: "45 Nguyễn Thị Minh Khai, Quận 3, TP. Hồ Chí Minh",
      mapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Nhà+thờ+Thánh+Xavier",
      dressCode: "Trang trọng truyền thống",
      contact: "+84 900 123 456",
    },
  },
  title: "Về chung một nhà",
  bride: "Khánh Linh",
  groom: "Hoàng Minh",
  introduction: "Hai trái tim. Ngàn khoảnh khắc nhỏ. Một đời bên nhau.",
  message:
    "Có những niềm vui quá lớn để giữ riêng mình. Bằng tất cả thương mến, chúng mình mong được đón bạn trong ngày trọng đại.",
  story:
    "Một lần tình cờ gặp nhau, một cuộc trò chuyện kéo dài hơn dự định, và một cảm giác chưa từng rời đi. Từ ly cà phê đầu tiên ở Hà Nội đến những nơi chúng mình đã gọi là nhà, điều đẹp nhất của mọi hành trình vẫn luôn là có nhau.",
  hero: "/images/editorial.jpg",
  // Placeholders until real portraits exist: both slots point at the one
  // couple photo, and the frames crop to opposite sides of it.
  groomPhoto: "/images/editorial.jpg",
  bridePhoto: "/images/editorial.jpg",
  music:
    "https://pub-74f7a05c91d24898be33ce0896e6de16.r2.dev/Le%CC%82%CC%83%20%C4%90u%CC%9Bo%CC%9B%CC%80ng.mp3",
  event: {
    date: "2026-12-20",
    time: "16:30",
    venue: "The Reverie Saigon",
    address: "22–36 Nguyễn Huệ, Bến Nghé, Quận 1, TP. Hồ Chí Minh",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=The+Reverie+Saigon",
    dressCode: "Tông trung tính, một chút thanh lịch",
    contact: "+84 900 123 456",
  },
  families: {
    groom: {
      label: "Nhà trai",
      father: "Nguyễn Hoàng Đạt",
      mother: "Lê Thị Thu Hà",
      address: "Quận 3, TP. Hồ Chí Minh",
    },
    bride: {
      label: "Nhà gái",
      father: "Trần Quang Vinh",
      mother: "Phạm Thị Ngọc Lan",
      address: "Quận Bình Thạnh, TP. Hồ Chí Minh",
    },
  },
  gift: {
    note: "Được đón bạn trong ngày vui đã là món quà lớn nhất. Nếu bạn muốn gửi thêm một lời chúc, đây là thông tin của hai bên gia đình.",
    accounts: [
      {
        id: "groom",
        side: "Nhà trai",
        holder: "NGUYEN HOANG MINH",
        bank: "Vietcombank",
        number: "1023456789",
        qr: "",
      },
      {
        id: "bride",
        side: "Nhà gái",
        holder: "TRAN KHANH LINH",
        bank: "Techcombank",
        number: "9988776655",
        qr: "",
      },
    ],
  },
  gallery: [
    {
      id: "one",
      src: "/images/editorial.jpg",
      alt: "Linh và Minh đi dạo trong khu vườn ngập nắng",
      caption: "Thêm một bước gần hơn đến mãi mãi.",
    },
    {
      id: "two",
      src: "/images/details.jpg",
      alt: "Lụa ngà và những chi tiết cưới trong nắng ấm",
      caption: "Những điều nhỏ, mình đều nhớ.",
    },
  ],
  timeline: [
    {
      id: "welcome",
      time: "16:30",
      title: "Đón khách",
      description: "Mời bạn đến sớm, ngồi xuống và nâng ly cùng chúng mình.",
    },
    {
      id: "vows",
      time: "17:00",
      title: "Nghi thức thành hôn",
      description: "Chương mới bắt đầu, với bạn ở ngay bên cạnh.",
    },
    {
      id: "dinner",
      time: "18:00",
      title: "Khai tiệc & lời chúc",
      description: "Món ngon, lời thật lòng, và những người thương nhất.",
    },
    {
      id: "dance",
      time: "19:30",
      title: "Tiệc ngọt dưới trời sao",
      description: "Một chút khiêu vũ. Rất nhiều kỷ niệm.",
    },
  ],
  sections: [
    { id: "0", title: "Lễ thành hôn", enabled: true },
    { id: "7", title: "Ảnh cô dâu chú rể", enabled: true },
    { id: "2", title: "Thông tin tiệc cưới", enabled: true },
    { id: "4", title: "Album ảnh", enabled: true },
    { id: "3", title: "Lịch trình ngày cưới", enabled: true },
  ],
};

const contentFor = (event: Invitation["event"]) => ({
  title: sharedInvitation.title,
  bride: sharedInvitation.bride,
  groom: sharedInvitation.groom,
  introduction: sharedInvitation.introduction,
  message: sharedInvitation.message,
  story: sharedInvitation.story,
  event: structuredClone(event),
  families: structuredClone(sharedInvitation.families),
  gift: structuredClone(sharedInvitation.gift),
  timeline: structuredClone(sharedInvitation.timeline),
  sections: structuredClone(sharedInvitation.sections),
});

export const invitation: Invitation = {
  ...sharedInvitation,
  ceremonyContent: {
    "thanh-hon": contentFor(sharedInvitation.ceremonyEvent["thanh-hon"]),
    "vu-quy": contentFor(sharedInvitation.ceremonyEvent["vu-quy"]),
  },
};
