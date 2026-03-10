import { useEffect, useMemo, useState, type ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card } from "@/design-system/ui";
import { HOME_HIGHLIGHTS, type IHomeHighlight } from "../data/homeHighlights";

export interface IHomeHeroItem {
  id: string;
  kind: "evento" | "ponto-turistico";
  title: string;
  subtitle?: string;
  image: string;
  href: string;
}

const FALLBACK_IMG = "/images/fallbacks/celeiro-highlight.jpg";
const AUTO_PLAY_INTERVAL_MS = 4500;

function getTagLabel(kind: IHomeHeroItem["kind"]): string {
  return kind === "evento"
    ? "Evento em destaque"
    : "Ponto turístico em destaque";
}

function getTagClassName(kind: IHomeHeroItem["kind"]): string {
  return kind === "evento"
    ? "bg-[var(--color-accent)] text-zinc-900"
    : "bg-white/90 text-zinc-900";
}

export function HomeHeroCarousel(): ReactElement | null {
  const navigate = useNavigate();
  const [index, setIndex] = useState<number>(0);

  const items: IHomeHeroItem[] = useMemo(
    () =>
      HOME_HIGHLIGHTS.map((item: IHomeHighlight) => ({
        id: item.id,
        kind: item.kind,
        title: item.titulo,
        subtitle: `${item.cidadeNome} • ${item.descricao}`,
        image: item.imageUrl,
        href: item.href,
      })),
    []
  );

  useEffect(() => {
    if (items.length <= 1) {
      return;
    }

    const timerId: number = window.setInterval(() => {
      setIndex((currentIndex: number) => (currentIndex + 1) % items.length);
    }, AUTO_PLAY_INTERVAL_MS);

    return () => {
      window.clearInterval(timerId);
    };
  }, [items.length]);

  useEffect(() => {
    if (items.length === 0) {
      return;
    }

    if (index > items.length - 1) {
      setIndex(0);
    }
  }, [index, items.length]);

  if (items.length === 0) {
    return null;
  }

  const currentItem: IHomeHeroItem = items[index];

  function handleNext(): void {
    setIndex((currentIndex: number) => (currentIndex + 1) % items.length);
  }

  return (
    <section className="pt-8 md:pt-12">
      <div className="mx-auto w-full max-w-7xl px-4">
        <div className="mb-6 space-y-3">
          <span className="inline-flex rounded-full bg-[var(--color-bg-light)] px-3 py-1 text-sm font-medium text-[var(--color-secondary)]">
            Celeiro do MS
          </span>

          <h1 className="max-w-4xl text-4xl font-bold leading-tight text-zinc-900 md:text-5xl">
            Descubra eventos, experiências e destinos que valorizam o território
            do Celeiro do MS
          </h1>

          <p className="max-w-2xl text-base leading-7 text-zinc-600 md:text-lg">
            Um portal público para conectar pessoas, cidades e oportunidades da
            região com navegação simples e conteúdo relevante.
          </p>
        </div>

        <Card className="overflow-hidden p-0">
          <div className="relative">
            <img
              src={currentItem.image || FALLBACK_IMG}
              alt={currentItem.title}
              className="h-64 w-full object-cover sm:h-80 lg:h-[420px]"
              loading="lazy"
              onError={(event) => {
                event.currentTarget.src = FALLBACK_IMG;
              }}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/30 to-transparent" />

            <div
              aria-live="polite"
              className="absolute inset-x-0 bottom-0 p-5 sm:p-6 md:p-8"
            >
              <div className="flex items-center gap-2">
                <span
                  className={[
                    "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
                    getTagClassName(currentItem.kind),
                  ].join(" ")}
                >
                  {getTagLabel(currentItem.kind)}
                </span>

                <span className="text-xs text-white/80">
                  {index + 1}/{items.length}
                </span>
              </div>

              <h2 className="mt-3 max-w-3xl text-2xl font-semibold text-white sm:text-3xl lg:text-4xl">
                {currentItem.title}
              </h2>

              {currentItem.subtitle ? (
                <p className="mt-2 max-w-2xl text-sm leading-6 text-white/85 sm:text-base">
                  {currentItem.subtitle}
                </p>
              ) : null}

              <div className="mt-5 flex flex-wrap gap-3">
                <Button
                  variant="primary"
                  onClick={() => navigate(currentItem.href)}
                >
                  Ver detalhes
                </Button>

                {items.length > 1 ? (
                  <Button variant="ghost" onClick={handleNext}>
                    Próximo
                  </Button>
                ) : null}
              </div>

              {items.length > 1 ? (
                <div className="mt-5 flex gap-2">
                  {items.map((item: IHomeHeroItem, itemIndex: number) => {
                    const isActive: boolean = itemIndex === index;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        aria-label={`Ir para destaque ${itemIndex + 1}`}
                        aria-current={isActive ? "true" : undefined}
                        onClick={() => setIndex(itemIndex)}
                        className={[
                          "h-2.5 rounded-full transition",
                          isActive
                            ? "w-8 bg-[var(--color-accent)]"
                            : "w-2.5 bg-white/40 hover:bg-white/70",
                        ].join(" ")}
                      />
                    );
                  })}
                </div>
              ) : null}
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}