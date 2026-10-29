import { getContent } from "@/lib/content";
import { Heading } from "./Heading";
import { VideoReviews } from "./VideoReviews";

// Блок скрыт, пока в панели нет ни кейсов, ни видео-отзывов: он появится сам после первой добавленной записи
export async function Cases() {
  const { cases, videos } = await getContent();
  if (cases.length === 0 && videos.length === 0) return null;

  return (
    <section id="cases" className="relative z-10 scroll-mt-20 bg-paper text-ink">
      <div className="mx-auto max-w-[100rem] px-5 py-24 sm:px-10">
        <Heading dot="text-ink">Кейсы и резиденты</Heading>

        {cases.length > 0 && (
          <ul className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
            {cases.map((c, i) => (
              <li key={i} className="flex flex-col rounded-3xl border border-ink/20 bg-white/50 p-6 sm:p-8">
                {c.tag && <span className="self-start rounded-full bg-ink px-3 py-1 text-xs font-bold uppercase tracking-wide text-paper">{c.tag}</span>}
                <h3 className="mt-5 text-2xl font-bold uppercase leading-tight tracking-tight">{c.title}</h3>
                {c.text && <p className="mt-3 text-base font-medium text-muted">{c.text}</p>}
                {c.stats.length > 0 && (
                  <dl className="mt-8 grid grid-cols-1 gap-4 border-t border-ink/15 pt-6 lg:grid-cols-2">
                    {c.stats.map(([value, label]) => (
                      <div key={label}>
                        <dd className="whitespace-nowrap text-xl font-extrabold tracking-tight sm:text-2xl">{value}</dd>
                        <dt className="mt-1 text-sm font-medium text-muted">{label}</dt>
                      </div>
                    ))}
                  </dl>
                )}
              </li>
            ))}
          </ul>
        )}

        {videos.length > 0 && (
          <>
            <h3 className="mt-20 text-xl font-bold uppercase tracking-tight">Видео-отзывы</h3>
            <VideoReviews videos={videos} />
          </>
        )}
      </div>
    </section>
  );
}
