import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Cidade, PontoTuristico } from "../domain";
import { Card, SectionHeader, Button, Tag, TextField, RoundedSelect } from "../shared/ui";
import { useCidadesStore } from "../context/cidadesStore";

const FALLBACK_IMG = "https://picsum.photos/900/520?blur=1";

type PontoView = {
  ponto: PontoTuristico;
  cidade?: Cidade;
};

function PontoCardList({
  item,
  onOpen,
}: {
  item: PontoView;
  onOpen: (id: string) => void;
}) {
  const { ponto, cidade } = item;

  return (
    <Card as="article" className="overflow-hidden">
      <img
        src={ponto.img || FALLBACK_IMG}
        alt={ponto.nome ? `Imagem do ponto: ${ponto.nome}` : "Imagem do ponto turístico"}
        className="h-44 w-full object-cover"
        loading="lazy"
        onError={(e) => ((e.currentTarget as HTMLImageElement).src = FALLBACK_IMG)}
      />
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-slate-900 line-clamp-2">{ponto.nome}</h3>
            <p className="mt-1 text-sm text-slate-600 line-clamp-1">
              {[cidade?.nome, ponto.horario].filter(Boolean).join(" • ")}
            </p>
            <p className="mt-1 text-xs text-slate-500 line-clamp-2">{ponto.desc}</p>
          </div>
          <div className="shrink-0 flex flex-col items-end gap-2">
            <Tag variant={ponto.destaque ? "warning" : "success"}>{ponto.tipo}</Tag>
            {ponto.destaque ? <Tag variant="warning">Destaque</Tag> : null}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="primary" size="sm" onClick={() => onOpen(ponto.id)}>
            Ver detalhes
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default function PontosTuristicosPage() {
  const navigate = useNavigate();
  const { cidades, loading, error } = useCidadesStore();

  // filtros
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [cidadeId, setCidadeId] = useState("");

  const pontosView = useMemo<PontoView[]>(() => {
    const list: PontoView[] = [];
    for (const c of cidades ?? []) {
      for (const p of c.pontos ?? []) {
        list.push({ ponto: p, cidade: c });
      }
    }
    return list;
  }, [cidades]);

  const typeOptions = useMemo(() => {
    const types = Array.from(new Set(pontosView.map((x) => x.ponto.tipo).filter(Boolean))).sort();
    return [{ value: "", label: "Todos os tipos" }, ...types.map((t) => ({ value: t, label: t }))];
  }, [pontosView]);

  const cidadeOptions = useMemo(() => {
    const list = (cidades ?? [])
      .slice()
      .sort((a, b) => a.nome.localeCompare(b.nome))
      .map((c) => ({ value: c.id, label: `${c.nome} / ${c.uf || "MS"}` }));

    return [{ value: "", label: "Todas as cidades" }, ...list];
  }, [cidades]);

  const filtrados = useMemo(() => {
    const q = search.trim().toLowerCase();

    return pontosView.filter(({ ponto, cidade }) => {
      const okCity = !cidadeId || cidade?.id === cidadeId;
      const okType = !type || ponto.tipo === type;
      const text = `${ponto.nome} ${ponto.tipo} ${cidade?.nome ?? ""}`.toLowerCase();
      const okSearch = !q || text.includes(q);
      return okCity && okType && okSearch;
    });
  }, [pontosView, search, type, cidadeId]);

  return (
    <div className="flex flex-col gap-6">
      <SectionHeader
        kicker="Turismo"
        tone="success"
        description="Busque pontos turísticos por cidade, tipo e palavra-chave."
      >
        Pontos turísticos
      </SectionHeader>

      {/* filtros */}
      <Card className="p-4">
        <div className="grid gap-3 md:grid-cols-3">
          <TextField
            label="Buscar"
            placeholder="Ex: parque, museu, praça..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="flex flex-col gap-1 text-sm">
            <label className="font-medium">Cidade</label>
            <RoundedSelect
              value={cidadeId}
              onChange={setCidadeId}
              options={cidadeOptions}
              placeholder="Todas"
            />
          </div>

          <div className="flex flex-col gap-1 text-sm">
            <label className="font-medium">Tipo</label>
            <RoundedSelect value={type} onChange={setType} options={typeOptions} placeholder="Todos" />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setSearch("");
              setCidadeId("");
              setType("");
            }}
          >
            Limpar filtros
          </Button>

          <div className="ml-auto text-xs text-slate-500">{filtrados.length} resultado(s)</div>
        </div>
      </Card>

      {/* estados */}
      {loading ? <Card className="p-6 text-sm text-slate-600">Carregando cidades e pontos...</Card> : null}
      {error ? <Card className="p-6 text-sm text-red-600">{error}</Card> : null}

      {/* lista */}
      {!loading && !error && filtrados.length === 0 ? (
        <Card className="p-6 text-sm text-slate-600">Nenhum ponto turístico encontrado.</Card>
      ) : null}

      {!loading && !error && filtrados.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtrados.map((item) => (
            <PontoCardList
              key={item.ponto.id}
              item={item}
              onOpen={(id) => navigate(`/pontos-turisticos/${id}`)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}