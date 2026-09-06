"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "motion/react";
import type { Guest, Invitation } from "@/types/invitation";
import { InvitationCover } from "./InvitationCover";
import {
  InvitationHero,
  CeremonyCard,
  CouplePortraits,
  ReceptionCard,
  VenueSection,
  EventTimeline,
  PhotoAlbum,
  ThankYou,
  InvitationClosing,
} from "./StorySections";
import { AutoScrollController } from "@/components/motion/AutoScrollController";
import { Icon } from "@/components/ui/Icon";

/**
 * The invitation itself. Data arrives as props from the server page, so there
 * is no loading state and no flash of an empty card before hydration.
 */
export function GuestExperience({
  invitation: data,
  guest,
  initialOpen = false,
}: {
  invitation: Invitation;
  guest: Guest;
  /** ?open=1 skips the envelope, as the reference template does. Resolved on
      the server so this component renders identically on both sides. */
  initialOpen?: boolean;
}) {
  const [open, setOpen] = useState(initialOpen);
  const [playing, setPlaying] = useState(false);
  const [audioError, setAudioError] = useState("");
  const audio = useRef<HTMLAudioElement>(null);
  const story = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  async function play() {
    try {
      await audio.current?.play();
      setPlaying(true);
      setAudioError("");
    } catch {
      setPlaying(false);
      setAudioError("Chạm vào nhạc để phát lại.");
    }
  }

  const enabled = (title: string) =>
    data.sections.find((s) => s.title === title)?.enabled ?? true;

  return (
    <div className="thiep" lang="vi">
      <audio
        ref={audio}
        src={data.music}
        loop
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => {
          setPlaying(false);
          setAudioError("Không tải được nhạc nền.");
        }}
      />
      <AnimatePresence onExitComplete={() => story.current?.focus()}>
        {!open && (
          <InvitationCover
            key="cover"
            invitation={data}
            guestName={guest.name}
            onOpen={() => {
              setOpen(true);
              void play();
            }}
          />
        )}
      </AnimatePresence>
      {/* Display:none until opened. The story is rendered behind the fixed
          cover, and IntersectionObserver does not care what is on top of it —
          leave it laid out and every reveal fires before anyone sees it. */}
      <div
        ref={story}
        className={`noi-dung${open ? "" : " an"}`}
        tabIndex={-1}
        inert={!open}
        aria-hidden={!open}
      >
        <InvitationHero data={data} />
        {enabled("Lễ thành hôn") && <CeremonyCard data={data} />}
        {enabled("Ảnh cô dâu chú rể") && <CouplePortraits data={data} />}
        {enabled("Thông tin tiệc cưới") && (
          <>
            <ReceptionCard data={data} />
            <VenueSection data={data} />
          </>
        )}
        {enabled("Album ảnh") && <PhotoAlbum data={data} />}
        {enabled("Lịch trình ngày cưới") && <EventTimeline data={data} />}
        <ThankYou data={data} />
        <InvitationClosing data={data} />
      </div>
      {open && (
        <div className="dieu-khien">
          <AutoScrollController autoStart />
          <button
            className="nut-nhac"
            aria-label={playing ? "Tắt nhạc nền" : "Bật nhạc nền"}
            aria-pressed={playing}
            title={playing ? "Tắt nhạc nền" : "Bật nhạc nền"}
            onClick={() => {
              if (playing) {
                audio.current?.pause();
              } else void play();
            }}
          >
            <Icon name="music" size={20} />
          </button>
          {audioError && <span role="status">{audioError}</span>}
        </div>
      )}
    </div>
  );
}
