"use client";

import { useState } from "react";
import { toEmbedUrl } from "@/lib/video";
import { safeHref } from "@/lib/safe-url";
import type { VideoItem } from "@/lib/types";

const tile = "group relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-3xl bg-ink text-paper";

function PlayButton() {
  return (
    <span aria-hidden="true" className="flex size-16 items-center justify-center rounded-full bg-lime text-ink transition-transform duration-300 group-hover:scale-110">
      <svg viewBox="0 0 24 24" className="size-7" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
    </span>
  );
}

function Cover({ video, caption }: { video: VideoItem; caption: string }) {
  return (
    <>
      {video.poster ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={video.poster} alt="" loading="lazy" className="absolute inset-0 size-full object-cover opacity-80" />
      ) : (
        <span aria-hidden="true" className="absolute inset-0 opacity-30 [background-image:repeating-linear-gradient(135deg,#BBFF00_0_1px,transparent_1px_8px)]" />
      )}
      <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
      <PlayButton />
      <span className="absolute bottom-4 left-5 right-5 text-sm font-medium text-paper">{caption}</span>
    </>
  );
}

// Плеер подгружается только после нажатия, поэтому сторонние площадки не отслеживают посетителя заранее
export function VideoReviews({ videos }: { videos: VideoItem[] }) {
  const [playing, setPlaying] = useState<number | null>(null);

  return (
    <ul className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
      {videos.map((v, i) => {
        const embed = v.url ? toEmbedUrl(v.url) : null;

        // Видео ещё не добавлено: плитка-заглушка
        if (!v.url) {
          return (
            <li key={i}>
              <div className={tile} role="img" aria-label={`${v.title} (скоро)`}>
                <Cover video={v} caption={`${v.title} · скоро`} />
              </div>
            </li>
          );
        }

        // Площадка не поддерживается плеером: открываем ссылку в новой вкладке
        if (!embed) {
          return (
            <li key={i}>
              <a href={safeHref(v.url)} target="_blank" rel="noopener noreferrer" className={tile} aria-label={`${v.title}: смотреть на сайте площадки`}>
                <Cover video={v} caption={`${v.title} ↗`} />
              </a>
            </li>
          );
        }

        return (
          <li key={i}>
            {playing === i ? (
              <iframe
                src={embed}
                title={v.title}
                allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                className="aspect-video w-full rounded-3xl border-0 bg-ink"
              />
            ) : (
              <button type="button" onClick={() => setPlaying(i)} className={tile} aria-label={`Смотреть видео: ${v.title}`}>
                <Cover video={v} caption={v.title} />
              </button>
            )}
          </li>
        );
      })}
    </ul>
  );
}
