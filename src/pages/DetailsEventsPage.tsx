import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { findEventById } from "../bff/appBff";
import type { Evento } from "../domain";
import { Button, Card, SectionHeader, Tag } from "../shared/ui";

const FALLBACK_IMG = "https://picsum.photos/1200/600?blur=1";

function formatDateBR(d: string) {
  try {
    return new Date(`${d}T00:00:00`).toLocaleDateString("pt-BR", {
      timeZone: "America/Campo_Grande",
    });
  } catch {
    return d;
  }
}

const DetailsEventsPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [evento, setEvento] = useState<Evento | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvento = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);

    try {
      const data = await findEventById(id);
      setEvento(data);
    } catch (e) {
      console.error(e);
      setError("Não foi possível carregar os detalhes do evento.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEvento();
  }, [fetchEvento]);

  const meta = useMemo(() => {
    if (!evento) return null;
    return {
      date: evento.data ? formatDateBR(evento.data) : "",
      time: evento.hora || "",
      where: evento.local || "",
      price: evento.preco || "",
    };
  }, [evento]);

  return (
    <div className="flex flex-col gap-6">
      {/* breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-xs text-slate-500">
        <button className="hover:text-slate-900" onClick={() => navigate("/")}>
          Home
        </button>
        <span className="mx-2">/</span>
        <button className="hover:text-slate-900" onClick={() => navigate("/eventos")}>
          Eventos
        </button>
        <span className="mx-2">/</span>
        <span className="text-slate-700">Detalhes</span>
      </nav>

      <SectionHeader
        kicker="Evento"
        tone="primary"
        description="Informações completas do evento."
      >
        Detalhes do evento
      </SectionHeader>

      {loading ? (
        <Card className="p-6 text-sm text-slate-600">Carregando...</Card>
      ) : null}

      {error ? (
        <Card className="p-6">
          <p className="text-sm text-red-600">{error}</p>
          <div className="mt-4 flex gap-2">
            <Button variant="secondary" onClick={() => navigate(-1)}>
              Voltar
            </Button>
            <Button variant="primary" onClick={fetchEvento}>
              Tentar novamente
            </Button>
          </div>
        </Card>
      ) : null}

      {!loading && !error && evento ? (
        <Card className="overflow-hidden">
          <img
            src={evento.img || FALLBACK_IMG}
            alt={evento.titulo ? `Imagem do evento: ${evento.titulo}` : "Imagem do evento"}
            className="h-64 w-full object-cover"
            loading="lazy"
            onError={(e) => ((e.currentTarget as HTMLImageElement).src = FALLBACK_IMG)}
          />

          <div className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">
                  {evento.titulo}
                </h1>
                <p className="mt-2 text-sm text-slate-600">
                  {[meta?.date, meta?.time, meta?.where].filter(Boolean).join(" • ")}
                </p>
                {meta?.price ? (
                  <p className="mt-1 text-sm text-slate-600">{meta.price}</p>
                ) : null}
              </div>

              <div className="flex items-center gap-2">
                <Tag variant="primary">{evento.cat}</Tag>
                {evento.destaque ? <Tag variant="warning">Destaque</Tag> : null}
              </div>
            </div>

            <div className="mt-6">
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {evento.desc}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <Button variant="secondary" onClick={() => navigate(-1)}>
                Voltar
              </Button>
              <Button variant="primary" onClick={() => navigate("/eventos")}>
                Ver lista de eventos
              </Button>
            </div>
          </div>
        </Card>
      ) : null}
    </div>
  );
};

export default DetailsEventsPage;