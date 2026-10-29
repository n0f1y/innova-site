"use client";

import Link from "next/link";
import { useState } from "react";
import { Eyebrow, Heading } from "./Heading";

const field =
  "mt-2 min-h-12 w-full rounded-xl border border-paper/30 bg-transparent px-4 text-base font-medium text-paper placeholder:text-paper/40 focus:border-lime focus:outline-none";

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <span className="flex items-baseline gap-2">
      {children}
      <span className="text-xs font-medium normal-case tracking-normal text-paper/60">{required ? "обязательно" : "по желанию"}</span>
    </span>
  );
}

// Форма пока без серверной части: данные никуда не отправляются
export function ApplyForm() {
  const [sent, setSent] = useState(false);

  return (
    <section id="apply" className="relative z-10 scroll-mt-20 border-t border-paper/15 bg-ink text-paper">
      <div className="mx-auto grid max-w-[100rem] grid-cols-1 gap-12 px-5 py-24 sm:px-10 lg:grid-cols-2">
        <div>
          <Eyebrow className="text-lime">Заявка резидента</Eyebrow>
          <Heading>Стать резидентом</Heading>
          <p className="mt-6 max-w-md text-lg font-medium leading-snug text-paper/80">
            Оставьте контакты — мы свяжемся с вами и подберём программу и тариф.
          </p>
        </div>

        {sent ? (
          <div role="status" className="self-start rounded-3xl border border-lime p-8">
            <p className="text-2xl font-extrabold uppercase tracking-tight text-lime">Спасибо!</p>
            <p className="mt-3 text-base font-medium text-paper/80">Форма пока работает в демо-режиме: данные никуда не отправляются.</p>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
            className="space-y-5"
          >
            <label className="block text-sm font-bold uppercase tracking-wide">
              <Label required>Имя</Label>
              <input required name="name" autoComplete="name" className={field} placeholder="Как к вам обращаться" />
            </label>
            <label className="block text-sm font-bold uppercase tracking-wide">
              <Label required>Телефон</Label>
              <input required type="tel" name="phone" autoComplete="tel" inputMode="tel" className={field} placeholder="+7 …" />
            </label>
            <label className="block text-sm font-bold uppercase tracking-wide">
              <Label required>Почта</Label>
              <input required type="email" name="email" autoComplete="email" className={field} placeholder="name@mail.ru" />
            </label>
            <label className="block text-sm font-bold uppercase tracking-wide">
              <Label>О проекте</Label>
              <textarea name="message" rows={4} className={`${field} py-3`} placeholder="Коротко о вашем стартапе" />
            </label>
            <label className="flex items-start gap-3 text-sm font-medium text-paper/80">
              <input required type="checkbox" className="mt-1 size-5 accent-lime" />
              <span>
                Согласен с <Link href="/privacy" className="underline decoration-lime underline-offset-4">политикой конфиденциальности</Link>
              </span>
            </label>
            <button type="submit" className="inline-flex min-h-12 items-center rounded-full bg-lime px-8 font-bold text-ink transition-transform duration-300 hover:scale-105">
              Оставить заявку
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
