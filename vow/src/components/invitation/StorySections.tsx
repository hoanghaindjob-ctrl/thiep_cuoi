import Image from "next/image";
import type { Invitation } from "@/types/invitation";
import { formatDate } from "@/lib/repository";
import { lunarLine } from "@/lib/lunar";
import { Reveal } from "@/components/motion/Reveal";
import { Icon } from "@/components/ui/Icon";
import { Countdown } from "./Countdown";
import { Album } from "./Album";
import { MiniCalendar } from "./MiniCalendar";
import { PeonySpray, Rosette, DoubleHappiness } from "./Ornaments";

function Divider() {
  return (
    <div className="hoa-van">
      <Rosette size={14} />
    </div>
  );
}

/** The day standing alone beside its month, with the lunar date beneath. */
function DateLockup({ date }: { date: string }) {
  return (
    <>
      <div className="ngay-lon">
        <b>{formatDate(date, { day: "2-digit" })}</b>
        <span aria-hidden="true" />
        <div>
          Tháng {formatDate(date, { month: "2-digit" })}
          <br />
          {formatDate(date, { year: "numeric" })}
        </div>
      </div>
      <p className="ngay-am">({lunarLine(date)})</p>
    </>
  );
}

export function InvitationHero({ data }: { data: Invitation }) {
  return (
    <section className="mo-dau">
      <Reveal className="mo-dau-nhan">Save the date</Reveal>
      {/* An open envelope with the photo still half inside it. */}
      <Reveal className="phong-thu" variant="hien" delay={0.12}>
        <div className="thu-nen" />
        <figure className="thu-anh">
          <div>
            <Image
              src={data.hero}
              alt={data.gallery[0]?.alt ?? "Ảnh cưới của cô dâu và chú rể"}
              fill
              priority
              unoptimized
              sizes="(max-width: 700px) 45vw, 200px"
            />
          </div>
        </figure>
        <div className="thu-truoc" />
        <PeonySpray className="thu-hoa trai" />
        <PeonySpray className="thu-hoa phai" />
        <div className="thu-trien">
          <DoubleHappiness />
        </div>
      </Reveal>
      <Reveal delay={0.3}>
        <h1 className="mo-dau-ten">
          <span>{data.groom}</span>
          <span>{data.bride}</span>
        </h1>
      </Reveal>
      <Reveal className="mo-dau-loi" delay={0.42}>
        {data.introduction}
      </Reveal>
    </section>
  );
}

/** Lễ thành hôn — the block a Vietnamese invitation is really built around. */
export function CeremonyCard({ data }: { data: Invitation }) {
  const { groom, bride } = data.families;
  const ceremonyName = data.ceremonyType === "vu-quy" ? "vu quy" : "thành hôn";
  return (
    <Reveal className="the the--phai" as="section">
      <PeonySpray className="the-hoa" />
      <h2 className="tieu-de">Thông tin lễ cưới</h2>
      <Divider />
      <div className="gia-dinh">
        <div>
          <h3>{groom.label}</h3>
          <p>
            Ông {groom.father}
            <br />
            Bà {groom.mother}
          </p>
          <small>{groom.address}</small>
        </div>
        <span aria-hidden="true" />
        <div>
          <h3>{bride.label}</h3>
          <p>
            Ông {bride.father}
            <br />
            Bà {bride.mother}
          </p>
          <small>{bride.address}</small>
        </div>
      </div>
      <p className="bao-tin">
        Trân trọng báo tin
        <br />
        lễ {ceremonyName} của con chúng tôi
      </p>
      <div className="cap-doi">
        <h3>{data.groom}</h3>
        <i aria-hidden="true">&</i>
        <h3>{data.bride}</h3>
      </div>
      <p className="cu-hanh">
        Lễ {ceremonyName} được cử hành tại
        <br />
        {data.event.venue}
      </p>
      <div className="hai-ben">
        <span>Vào lúc {data.event.time}</span>
        <span>{formatDate(data.event.date, { weekday: "long" })}</span>
      </div>
      <DateLockup date={data.event.date} />
    </Reveal>
  );
}

/** The couple, one portrait each, between the ceremony card and the album. */
export function CouplePortraits({ data }: { data: Invitation }) {
  return (
    <section className="doi-anh">
      <Reveal className="chu-re" as="figure" variant="trai">
        <div>
          <Image
            src={data.groomPhoto}
            alt={`Ảnh chú rể ${data.groom}`}
            fill
            unoptimized
            sizes="(max-width: 700px) 45vw, 260px"
          />
        </div>
        <figcaption>
          <span>Chú rể</span>
          <b>{data.groom}</b>
        </figcaption>
      </Reveal>
      <Reveal className="co-dau" as="figure" variant="phai" delay={0.14}>
        <div>
          <Image
            src={data.bridePhoto}
            alt={`Ảnh cô dâu ${data.bride}`}
            fill
            unoptimized
            sizes="(max-width: 700px) 45vw, 260px"
          />
        </div>
        <figcaption>
          <span>Cô dâu</span>
          <b>{data.bride}</b>
        </figcaption>
      </Reveal>
    </section>
  );
}

/** Google Calendar wants UTC stamps; the ceremony is quoted in Asia/Ho_Chi_Minh. */
function calendarUrl(data: Invitation) {
  const [h, m] = data.event.time.split(":").map(Number);
  const start = new Date(`${data.event.date}T00:00:00Z`);
  start.setUTCHours((h || 0) - 7, m || 0, 0, 0);
  const end = new Date(start.getTime() + 3 * 60 * 60 * 1000);
  const stamp = (d: Date) =>
    d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const title = `Đám cưới ${data.groom} & ${data.bride}`;
  const where = `${data.event.venue}, ${data.event.address}`;
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    title,
  )}&dates=${stamp(start)}/${stamp(end)}&location=${encodeURIComponent(
    where,
  )}&ctz=Asia/Ho_Chi_Minh`;
}

export function ReceptionCard({ data }: { data: Invitation }) {
  const banquet = data.timeline.find((t) => /khai tiệc/i.test(t.title));
  return (
    <Reveal className="the the--trai" as="section">
      <PeonySpray className="the-hoa" />
      <h2 className="tieu-de">Thông tin tiệc cưới</h2>
      <Divider />
      <p className="cu-hanh">Tiệc cưới sẽ diễn ra vào lúc</p>
      <div className="hai-ben">
        <span>{formatDate(data.event.date, { weekday: "long" })}</span>
        <span>{banquet?.time ?? data.event.time}</span>
      </div>
      <DateLockup date={data.event.date} />
      <div className="gio-tiec">
        <div>
          <span>Đón khách</span>
          <b>{data.event.time}</b>
        </div>
        <span aria-hidden="true" />
        <div>
          <span>Khai tiệc</span>
          <b>{banquet?.time ?? data.event.time}</b>
        </div>
      </div>
      <MiniCalendar date={data.event.date} />
      <a className="them-lich" href={calendarUrl(data)} target="_blank" rel="noreferrer">
        <Icon name="calendar" size={14} />
        Thêm vào lịch
      </a>
      <p className="dem-nhan">Cùng đếm ngược đến ngày vui</p>
      <Countdown date={data.event.date} time={data.event.time} />
    </Reveal>
  );
}

export function VenueSection({ data }: { data: Invitation }) {
  const safe = /^https?:\/\//.test(data.event.mapsUrl);
  const q = encodeURIComponent(`${data.event.venue}, ${data.event.address}`);
  return (
    <section className="dia-diem">
      <Reveal>
        <h2 className="tieu-de">Tiệc cưới sẽ tổ chức tại</h2>
        <p className="dia-diem-ten">{data.event.venue}</p>
        <p>{data.event.address}</p>
      </Reveal>
      <Reveal className="ban-do" variant="hien" delay={0.12}>
        <iframe
          src={`https://maps.google.com/maps?q=${q}&output=embed`}
          title={`Bản đồ tới ${data.event.venue}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </Reveal>
      {safe && (
        <a
          className="button"
          href={data.event.mapsUrl}
          target="_blank"
          rel="noreferrer"
        >
          <Icon name="pin" size={15} />
          Chỉ đường
        </a>
      )}
    </section>
  );
}

export function EventTimeline({ data }: { data: Invitation }) {
  return (
    <Reveal className="the the--phai" as="section">
      <PeonySpray className="the-hoa" />
      <h2 className="tieu-de">Lịch trình ngày cưới</h2>
      <Divider />
      <ol className="lich-trinh">
        {data.timeline.map((item, i) => (
          <Reveal as="li" key={item.id} delay={0.07 * i}>
            <time>{item.time}</time>
            <span className="cham-tron" aria-hidden="true" />
            <div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </Reveal>
        ))}
      </ol>
    </Reveal>
  );
}

export function PhotoAlbum({ data }: { data: Invitation }) {
  return (
    <section className="album">
      <Reveal>
        <h2 className="tieu-de">Album ảnh</h2>
      </Reveal>
      <Reveal variant="hien" delay={0.12}>
        <Album items={data.gallery} />
      </Reveal>
    </section>
  );
}

/** A framed thank-you note, in the couple's own voice, before the sign-off. */
export function ThankYou({ data }: { data: Invitation }) {
  return (
    <section className="cam-on">
      <Reveal className="cam-on-khung" variant="hien">
        <span className="cam-on-hoa mot" aria-hidden="true">
          <Rosette size={11} />
        </span>
        <span className="cam-on-hoa hai" aria-hidden="true">
          <Rosette size={9} />
        </span>
        <span className="cam-on-hoa ba" aria-hidden="true">
          <Rosette size={10} />
        </span>
        <h2 className="cam-on-de">Trân trọng cảm ơn</h2>
        <div className="hoa-van">
          <Rosette size={14} />
        </div>
        <p>
          Cảm ơn bạn đã dành thời gian ghé thăm và gửi những lời chúc yêu thương
          đến chúng mình.
        </p>
        <p>
          Sự hiện diện và lời chúc của bạn là niềm vui và hạnh phúc lớn đối với
          chúng mình trong ngày đặc biệt này.
        </p>
        <p>
          Dù gần hay xa, chúng mình đều trân trọng từng tình cảm bạn dành cho
          ngày vui của hai đứa. Thương mến và biết ơn bạn thật nhiều!
        </p>
        <span className="cam-on-than">Thân</span>
        <span className="ky-ten">
          <span>{data.groom}</span>
          <span className="ky-ten-va">&amp;</span>
          <span>{data.bride}</span>
        </span>
      </Reveal>
    </section>
  );
}

export function InvitationClosing({ data }: { data: Invitation }) {
  return (
    <footer className="ket">
      <Reveal>
        <h2 className="tieu-de">Hẹn gặp bạn trong ngày vui</h2>
        <Divider />
        <p>
          {data.groom} &amp; {data.bride}
        </p>
      </Reveal>
    </footer>
  );
}
