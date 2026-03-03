import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Evento } from "../domain";
import { Card, SectionHeader, Button, Tag, TextField, RoundedSelect } from "../shared/ui";
import { useEventosStore } from "../context/eventosStore";

const FALLBACK_IMG = "https://picsum.photos/900/520?blur=1";

function formatDateBR(d: string) {
  // espera yyyy-mm-dd
  try {
    return new Date(`${d}T00:00:00`).toLocaleDateString("pt-BR", {
      timeZone: "America/Campo_Grande",
    });
  } catch {
    return d;
  }
}

function EventCardList({ ev, onOpen }: { ev: Evento; onOpen: (id: string) => void }) {
  return (
    <Card as="article" className="overflow-hidden">
      <img
        src={ev.img || FALLBACK_IMG}
        alt={ev.titulo ? `Imagem do evento: ${ev.titulo}` : "Imagem do evento"}
        className="h-44 w-full object-cover"
        loading="lazy"
        onError={(e) => ((e.currentTarget as HTMLImageElement).src = FALLBACK_IMG)}
      />
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-slate-900 line-clamp-2">{ev.titulo}</h3>
            <p className="mt-1 text-sm text-slate-600 line-clamp-1">{ev.local}</p>
            <p className="mt-1 text-xs text-slate-500">
              {formatDateBR(ev.data)} {ev.hora ? `• ${ev.hora}` : ""} • {ev.preco}
            </p>
          </div>
          <div className="shrink-0">
            <Tag variant={ev.destaque ? "warning" : "primary"}>{ev.cat}</Tag>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="primary" size="sm" onClick={() => onOpen(ev.id)}>
            Ver detalhes
          </Button>
          {ev.destaque ? <Tag variant="warning">Destaque</Tag> : null}
        </div>
      </div>
    </Card>
  );
}

export default function EventosPage() {
  const navigate = useNavigate();
  const { eventos, loading, error } = useEventosStore();

  // filtros
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [dateFrom, setDateFrom] = useState("");

  const categoryOptions = useMemo(() => {
    const cats = Array.from(new Set((eventos ?? []).map((e) => e.cat).filter(Boolean))).sort();
    return [
      { value: "", label: "Todas as categorias" },
      ...cats.map((c) => ({ value: c, label: c })),
    ];
  }, [eventos]);

  const eventosFiltrados = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = (eventos ?? []).slice().sort((a, b) => a.data.localeCompare(b.data));

    return list.filter((ev) => {
      const okCat = !category || ev.cat === category;
      const okDate = !dateFrom || ev.data >= dateFrom;
      const text = `${ev.titulo} ${ev.local} ${ev.cat}`.toLowerCase();
      const okSearch = !q || text.includes(q);
      return okCat && okDate && okSearch;
    });
  }, [eventos, search, category, dateFrom]);

  return (
    <div className="flex flex-col gap-6">
      <SectionHeader
        kicker="Eventos"
        tone="primary"
        description="Encontre eventos por categoria, data e palavra-chave."
      >
        Agenda de eventos
      </SectionHeader>

      {/* filtros */}
      <Card className="p-4">
        <div className="grid gap-3 md:grid-cols-3">
          <TextField
            label="Buscar"
            placeholder="Ex: show, feira, praça..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="flex flex-col gap-1 text-sm">
            <label className="font-medium">Categoria</label>
            <RoundedSelect
              value={category}
              onChange={setCategory}
              options={categoryOptions}
              placeholder="Todas"
            />
          </div>

          <TextField
            label="A partir de"
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setSearch("");
              setCategory("");
              setDateFrom("");
            }}
          >
            Limpar filtros
          </Button>

          <div className="ml-auto text-xs text-slate-500">
            {eventosFiltrados.length} resultado(s)
          </div>
        </div>
      </Card>

      {/* estados */}
      {loading ? <Card className="p-6 text-sm text-slate-600">Carregando eventos...</Card> : null}
      {error ? <Card className="p-6 text-sm text-red-600">{error}</Card> : null}

      {/* lista */}
      {!loading && !error && eventosFiltrados.length === 0 ? (
        <Card className="p-6 text-sm text-slate-600">
          Nenhum evento encontrado com os filtros atuais.
        </Card>
      ) : null}

      {!loading && !error && eventosFiltrados.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {eventosFiltrados.map((ev) => (
            <EventCardList key={ev.id} ev={ev} onOpen={(id) => navigate(`/eventos/${id}`)} />
          ))}
        </div>
      ) : null}
    </div>
  );
}