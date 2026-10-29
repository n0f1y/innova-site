"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { CTA, nav } from "@/data/content";
import type { FooterInfo } from "@/lib/types";
import { safeHref } from "@/lib/safe-url";
import { contactRows } from "@/lib/contact-rows";

const FOCUSABLE = "a[href], button:not([disabled])";

// Фиксированная шапка: прозрачная над фото, затемнённая при прокрутке.
// Меню из ТЗ видно от xl (1280px), ниже — гамбургер с полноэкранным меню.
export function Header({ siteName, footer }: { siteName: string; footer: FooterInfo }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);

  // Блокировку прокрутки снимаем сразу при закрытии: иначе переход по якорю
  // срабатывает раньше, чем она снимется, и страница не прокручивается
  const unlock = () => {
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
  };

  const close = useCallback((returnFocus = false) => {
    unlock();
    setOpen(false);
    if (returnFocus) burgerRef.current?.focus();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Открытое меню: блокировка прокрутки, фокус на первом пункте, Escape и «ловушка» Tab
  useEffect(() => {
    if (!open) return;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    headerRef.current?.querySelector<HTMLElement>("#mobile-menu a")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close(true);
        return;
      }
      if (e.key !== "Tab" || !headerRef.current) return;
      const items = [...headerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => el.offsetParent !== null);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (!active || !headerRef.current.contains(active)) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      unlock();
    };
  }, [open, close]);

  // Если окно стало шире порога десктопного меню (поворот экрана, планшет), мобильное меню закрываем
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1280px)");
    const onChange = () => mq.matches && close();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [close]);

  return (
    <header
      ref={headerRef}
      className={`fixed inset-x-0 top-0 z-50 text-paper transition-colors duration-300 ${open ? "bg-ink" : scrolled ? "bg-ink/85 backdrop-blur-md" : "bg-transparent"}`}
    >
      <div className="mx-auto flex max-w-[100rem] items-center justify-between gap-6 px-5 py-4 sm:px-10">
        <Link href="/" onClick={() => close()} className="flex items-center" aria-label={`${siteName}: на главную`}>
          {/* Логотип цвета акцента: шапка лежит на тёмном фоне и на фото */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo-lime.png" alt={siteName} width={700} height={250} className="h-12 w-auto sm:h-16" />
        </Link>

        <nav aria-label="Основное меню" className="hidden items-center gap-7 text-sm font-bold uppercase tracking-wide xl:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="decoration-lime decoration-2 underline-offset-8 hover:underline">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href={CTA.href}
            className="hidden min-h-11 items-center rounded-full bg-lime px-5 text-sm font-bold text-ink transition-transform duration-300 hover:scale-105 sm:inline-flex"
          >
            {CTA.label}
          </Link>
          <button
            ref={burgerRef}
            type="button"
            onClick={() => (open ? close() : setOpen(true))}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Закрыть меню" : "Открыть меню"}
            className="relative flex size-11 items-center justify-center rounded-full border border-paper/30 transition-colors duration-300 hover:border-lime xl:hidden"
          >
            <span aria-hidden="true" className={`absolute h-0.5 w-5 bg-paper transition-transform duration-300 ${open ? "rotate-45" : "-translate-y-1.5"}`} />
            <span aria-hidden="true" className={`absolute h-0.5 w-5 bg-paper transition-opacity duration-300 ${open ? "opacity-0" : "opacity-100"}`} />
            <span aria-hidden="true" className={`absolute h-0.5 w-5 bg-paper transition-transform duration-300 ${open ? "-rotate-45" : "translate-y-1.5"}`} />
          </button>
        </div>
      </div>

      {open && (
        <div
          id="mobile-menu"
          className="absolute inset-x-0 top-full h-[calc(100dvh-100%)] overflow-y-auto overscroll-contain border-t border-paper/15 bg-ink [animation:menu-in_0.28s_ease-out] xl:hidden"
        >
          <div className="mx-auto flex min-h-full max-w-[100rem] flex-col px-5 pb-8 pt-2 sm:px-10">
            <nav aria-label="Мобильное меню">
              <ul>
                {nav.map((item, i) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => close()}
                      style={{ animationDelay: `${80 + i * 45}ms` }}
                      className="group flex items-baseline gap-4 border-b border-paper/10 py-4 text-2xl font-extrabold uppercase leading-tight tracking-tight [animation:menu-link_0.45s_ease-out_both] min-[375px]:text-3xl sm:text-4xl"
                    >
                      <span className="w-7 shrink-0 text-sm font-bold tabular-nums text-lime">{String(i + 1).padStart(2, "0")}</span>
                      <span className="flex-1 [text-wrap:balance]">{item.label}</span>
                      <span aria-hidden="true" className="text-xl text-lime transition-transform duration-300 group-active:translate-x-1">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <Link
              href={CTA.href}
              onClick={() => close()}
              className="mt-8 inline-flex min-h-14 items-center justify-center rounded-full bg-lime px-6 text-lg font-bold text-ink transition-transform duration-300 active:scale-[0.98]"
            >
              {CTA.label}
            </Link>

            <div className="mt-auto pt-10 text-sm font-medium text-paper/70">
              <dl className="space-y-1">
                {contactRows(footer).map((r) => (
                  <div key={r.label} className="flex gap-2">
                    <dt className="text-paper/50">{r.label}:</dt>
                    <dd>
                      {r.href ? (
                        <a href={safeHref(r.href)} className="font-bold text-paper underline decoration-lime underline-offset-4">{r.value}</a>
                      ) : (
                        r.value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
