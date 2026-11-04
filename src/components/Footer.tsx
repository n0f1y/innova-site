"use client";

import Link from "next/link";
import { useState } from "react";
import { disclaimer, footerDescription, nav } from "@/data/content";
import type { FooterInfo } from "@/lib/types";
import { safeHref } from "@/lib/safe-url";
import { contactRows } from "@/lib/contact-rows";

export function Footer({ siteName, footer }: { siteName: string; footer: FooterInfo }) {
  const [subscribed, setSubscribed] = useState(false);

  return (
    <footer id="contacts" className="relative z-10 scroll-mt-20 border-t border-paper/15 bg-ink text-paper">
      <div className="mx-auto grid max-w-[100rem] grid-cols-1 gap-12 px-5 py-16 sm:px-10 lg:grid-cols-[1.2fr_1fr_1fr_1.2fr]">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo-lime-slogan.png" alt={siteName} width={800} height={285} loading="lazy" className="h-28 w-auto" />
          <p className="mt-4 max-w-xs text-sm font-medium leading-relaxed text-paper/70">{footerDescription}</p>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-lime">Контакты</h3>
          <dl className="mt-4 space-y-2 text-sm font-medium leading-relaxed">
            {contactRows(footer).map((r) => (
              <div key={r.label} className="flex gap-2">
                <dt className="text-paper/60">{r.label}:</dt>
                <dd>
                  {r.href ? (
                    <a href={safeHref(r.href)} className="underline decoration-lime underline-offset-4">{r.value}</a>
                  ) : (
                    r.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-lime">Быстрые ссылки</h3>
          <ul className="mt-4 space-y-2 text-sm font-medium">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:underline">{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-lime">Рассылка</h3>
          {subscribed ? (
            <p role="status" className="mt-4 text-sm font-medium text-paper/80">Спасибо! Подписка работает в демо-режиме: адрес никуда не отправляется.</p>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubscribed(true);
              }}
              className="mt-4"
            >
              <label htmlFor="newsletter" className="sr-only">E-mail для рассылки</label>
              <div className="flex gap-2">
                <input
                  id="newsletter"
                  required
                  type="email"
                  autoComplete="email"
                  placeholder="Ваш e-mail"
                  className="min-h-11 min-w-0 flex-1 rounded-full border border-paper/30 bg-transparent px-4 text-sm font-medium placeholder:text-paper/40 focus:border-lime focus:outline-none"
                />
                <button type="submit" className="min-h-11 rounded-full bg-lime px-5 text-sm font-bold text-ink">Подписаться</button>
              </div>
            </form>
          )}
        </div>
      </div>

      <div className="border-t border-paper/15">
        <div className="mx-auto max-w-[100rem] px-5 py-6 sm:px-10">
          <p className="max-w-4xl text-xs font-medium leading-relaxed text-paper/60">{disclaimer}</p>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs font-medium text-paper/60">
            <p>© {new Date().getFullYear()} {siteName}</p>
            <span className="flex flex-wrap gap-x-6 gap-y-2">
              <Link href="/privacy" className="hover:text-paper hover:underline">Политика конфиденциальности</Link>
              <Link href="/consent" className="hover:text-paper hover:underline">Согласие на обработку персональных данных</Link>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
