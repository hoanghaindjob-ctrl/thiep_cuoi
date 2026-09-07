export interface EventDetails {
  date: string;
  time: string;
  venue: string;
  address: string;
  mapsUrl: string;
  dressCode: string;
  contact: string;
}
export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  caption: string;
}
export interface TimelineItem {
  id: string;
  time: string;
  title: string;
  description: string;
}
export interface InvitationSection {
  id: string;
  title: string;
  enabled: boolean;
}
/** One side of the family, as a Vietnamese invitation names it. */
export interface FamilySide {
  label: string;
  father: string;
  mother: string;
  address: string;
}
export interface Families {
  groom: FamilySide;
  bride: FamilySide;
}
export interface GiftAccount {
  id: string;
  side: string;
  holder: string;
  bank: string;
  number: string;
  /** Optional uploaded bank QR image. Rendered instead of the monogram when set. */
  qr: string;
}
export interface Gift {
  note: string;
  accounts: GiftAccount[];
}
export interface Invitation {
  slug: string;
  /** Cho phép dùng cùng một mẫu cho lễ nhà trai hoặc lễ nhà gái. */
  ceremonyType: "thanh-hon" | "vu-quy";
  title: string;
  bride: string;
  groom: string;
  introduction: string;
  message: string;
  story: string;
  hero: string;
  /** Portrait of the groom, shown beside the bride's. */
  groomPhoto: string;
  /** Portrait of the bride. */
  bridePhoto: string;
  music: string;
  event: EventDetails;
  families: Families;
  gift: Gift;
  gallery: GalleryItem[];
  timeline: TimelineItem[];
  sections: InvitationSection[];
}
export type RSVPStatus = "Awaiting reply" | "Attending" | "Declined";
export interface Guest {
  token: string;
  name: string;
  contact: string;
  group: string;
  attendees: number;
  status: RSVPStatus;
  message: string;
}
