import { getContent } from "@/lib/content";
import { Heading } from "./Heading";
import { ExpertsGrid } from "./ExpertsGrid";

// Блок скрыт, пока в панели нет ни одного эксперта: список пополняется по мере согласования менторов
export async function Experts() {
  const { experts } = await getContent();
  if (experts.length === 0) return null;

  return (
    <section id="experts" className="relative z-10 scroll-mt-20 border-t border-ink/15 bg-paper text-ink">
      <div className="mx-auto max-w-[100rem] px-5 py-24 sm:px-10">
        <Heading dot="text-ink">Эксперты и менторы</Heading>
        <ExpertsGrid experts={experts} />
      </div>
    </section>
  );
}
