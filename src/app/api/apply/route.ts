import { NextResponse } from "next/server";
import { sendApplication, telegramConfigured } from "@/lib/telegram";

export const dynamic = "force-dynamic";

// Простое ограничение частоты: не более 5 заявок за 10 минут с одного адреса (в памяти одного экземпляра)
const hits = new Map<string, number[]>();
const WINDOW = 10 * 60 * 1000;
const LIMIT = 5;

function limited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > LIMIT;
}

const clean = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req: Request) {
  // Пока бот и политика не подключены, заявки не принимаем и сообщаем об этом форме
  if (!telegramConfigured()) return NextResponse.json({ status: "disabled" }, { status: 503 });

  // Только с нашего же сайта
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (!origin || !host || new URL(origin).host !== host) return NextResponse.json({ status: "forbidden" }, { status: 403 });

  const ip = (req.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
  if (limited(ip)) return NextResponse.json({ status: "rate_limited" }, { status: 429 });

  if (Number(req.headers.get("content-length") ?? 0) > 10_000) return NextResponse.json({ status: "invalid" }, { status: 413 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ status: "invalid" }, { status: 400 });
  }

  // Скрытое поле, которое заполняют только боты: делаем вид, что всё принято
  if (clean(body.website, 100)) return NextResponse.json({ status: "ok" });

  const a = {
    name: clean(body.name, 100),
    phone: clean(body.phone, 30),
    email: clean(body.email, 120),
    message: clean(body.message, 1500),
  };
  const valid =
    a.name.length >= 2 && /^[+\d][\d\s()\-]{6,}$/.test(a.phone) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(a.email) && body.consent === true;
  if (!valid) return NextResponse.json({ status: "invalid" }, { status: 400 });

  const ok = await sendApplication(a);
  return ok ? NextResponse.json({ status: "ok" }) : NextResponse.json({ status: "error" }, { status: 502 });
}
