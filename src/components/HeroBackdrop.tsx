"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

// Два фиксированных фото. Пока листаем от первого экрана к услугам:
// фото 1 растворяется, фото 2 проявляется, затемнение растёт до уровня,
// при котором светлый текст читается на любом участке снимка.
export function HeroBackdrop() {
  const first = useRef<HTMLDivElement>(null);
  const second = useRef<HTMLDivElement>(null);
  const dim = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const p = Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * 0.9)));
      const swap = smooth(0.25, 0.85, p);
      if (first.current) first.current.style.opacity = String(1 - swap);
      if (second.current) second.current.style.opacity = String(swap);
      if (dim.current) dim.current.style.opacity = String(smooth(0, 0.9, p));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 bg-ink" aria-hidden="true">
      <div ref={second} className="absolute inset-0 opacity-0" style={{ willChange: "opacity" }}>
        <Image src="/services.webp" alt="" fill loading="eager" sizes="100vw" className="object-cover" />
      </div>
      <div ref={first} className="absolute inset-0" style={{ willChange: "opacity" }}>
        <Image src="/hero.webp" alt="" fill priority sizes="100vw" className="object-cover object-[65%_center]" />
        {/* Подложка под текст первого экрана: слева и снизу темнее */}
        <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/40 to-ink/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/5 to-ink/30" />
      </div>
      {/* Затемнение при прокрутке: на втором фото держит читаемость карточек */}
      <div ref={dim} className="absolute inset-0 bg-ink/75 opacity-0" style={{ willChange: "opacity" }} />
    </div>
  );
}
