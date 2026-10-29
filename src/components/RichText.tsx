import { safeHref } from "@/lib/safe-url";

// Вывод текста материала из панели (Portable Text). Поддерживаются только знакомые элементы:
// абзацы, заголовки, цитаты, списки, жирный, курсив, ссылки и картинки. Всё остальное игнорируется.
type Span = { _type: "span"; text: string; marks?: string[] };
type MarkDef = { _key: string; _type: string; href?: string };
export type Block =
  | { _type: "block"; _key: string; style?: string; listItem?: "bullet" | "number"; children?: Span[]; markDefs?: MarkDef[] }
  | { _type: "image"; _key: string; url?: string; alt?: string };

function Inline({ block }: { block: Extract<Block, { _type: "block" }> }) {
  return (
    <>
      {(block.children ?? []).map((span, i) => {
        let node: React.ReactNode = span.text;
        for (const mark of span.marks ?? []) {
          if (mark === "strong") node = <strong>{node}</strong>;
          else if (mark === "em") node = <em>{node}</em>;
          else {
            const def = block.markDefs?.find((d) => d._key === mark && d._type === "link");
            if (def) {
              node = (
                <a href={safeHref(def.href)} target="_blank" rel="noopener noreferrer" className="underline decoration-lime decoration-2 underline-offset-4">
                  {node}
                </a>
              );
            }
          }
        }
        return <span key={i}>{node}</span>;
      })}
    </>
  );
}

export function RichText({ blocks }: { blocks: Block[] }) {
  const out: React.ReactNode[] = [];
  let i = 0;
  while (i < blocks.length) {
    const b = blocks[i];

    if (b._type === "image") {
      if (b.url) {
        out.push(
          // eslint-disable-next-line @next/next/no-img-element
          <img key={b._key} src={`${b.url}?w=1400&auto=format&q=80`} alt={b.alt ?? ""} loading="lazy" className="my-8 w-full rounded-2xl" />,
        );
      }
      i++;
      continue;
    }

    if (b._type === "block" && b.listItem) {
      const kind = b.listItem;
      const items: Extract<Block, { _type: "block" }>[] = [];
      while (i < blocks.length) {
        const n = blocks[i];
        if (n._type === "block" && n.listItem === kind) {
          items.push(n);
          i++;
        } else break;
      }
      const List = kind === "number" ? "ol" : "ul";
      out.push(
        <List key={items[0]._key} className={`my-5 space-y-2 pl-6 ${kind === "number" ? "list-decimal" : "list-disc"} marker:text-lime`}>
          {items.map((it) => (
            <li key={it._key}>
              <Inline block={it} />
            </li>
          ))}
        </List>,
      );
      continue;
    }

    if (b._type === "block") {
      const content = <Inline block={b} />;
      if (b.style === "h2") out.push(<h2 key={b._key} className="mt-12 text-2xl font-bold uppercase leading-tight tracking-tight sm:text-3xl">{content}</h2>);
      else if (b.style === "h3") out.push(<h3 key={b._key} className="mt-8 text-xl font-bold leading-tight tracking-tight sm:text-2xl">{content}</h3>);
      else if (b.style === "blockquote") out.push(<blockquote key={b._key} className="my-6 border-l-4 border-lime pl-5 text-xl font-medium italic">{content}</blockquote>);
      else out.push(<p key={b._key} className="my-5">{content}</p>);
    }
    i++;
  }
  return <div className="text-lg font-medium leading-relaxed">{out}</div>;
}
