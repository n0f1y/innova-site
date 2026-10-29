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

type State = "idle" | "sending" | "sent" | "disabled" | "error";

// Заявка уходит на /api/apply. Пока приём не включён на сервере, форма честно сообщает об этом
export function ApplyForm() {
  const [state, setState] = useState<State>("idle");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setState("sending");
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: f.get("name"),
          phone: f.get("phone"),
          email: f.get("email"),
          message: f.get("message"),
          website: f.get("website"),
          consent: f.get("consent") === "on",
        }),
      });
      setState(res.ok ? "sent" : res.status === 503 ? "disabled" : "error");
    } catch {
      setState("error");
    }
  }

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

        {state === "sent" || state === "disabled" ? (
          <div role="status" className="self-start rounded-3xl border border-lime p-8">
            <p className="text-2xl font-extrabold uppercase tracking-tight text-lime">{state === "sent" ? "Спасибо!" : "Скоро откроем"}</p>
            <p className="mt-3 text-base font-medium text-paper/80">
              {state === "sent" ? "Заявка отправлена, мы свяжемся с вами." : "Приём заявок через сайт пока не включён. Свяжитесь с нами по контактам внизу страницы."}
            </p>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-5">
            {/* Ловушка для ботов: людям не видна */}
            <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 opacity-0" />
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
              <input required type="checkbox" name="consent" className="mt-1 size-5 accent-lime" />
              <span>
                Согласен с <Link href="/privacy" className="underline decoration-lime underline-offset-4">политикой конфиденциальности</Link>
              </span>
            </label>
            {state === "error" && (
              <p role="alert" className="text-sm font-medium text-paper/80">Не удалось отправить заявку. Попробуйте ещё раз чуть позже или свяжитесь с нами по контактам внизу страницы.</p>
            )}
            <button
              type="submit"
              disabled={state === "sending"}
              className="inline-flex min-h-12 items-center rounded-full bg-lime px-8 font-bold text-ink transition-transform duration-300 hover:scale-105 disabled:opacity-60"
            >
              {state === "sending" ? "Отправляем…" : "Оставить заявку"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
