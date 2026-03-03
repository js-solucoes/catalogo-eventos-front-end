import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, HeroSection, Button } from "../shared/ui";
import { cidadesCeleiro } from "../features/home/data/cidadesCeleiro";

const FALLBACK_IMG = "https://picsum.photos/1200/600?blur=1";

export default function CityDetailsPage() {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();

  const cidade = useMemo(
    () => cidadesCeleiro.find((c) => c.slug === slug),
    [slug]
  );

  if (!cidade) {
    return (
      <Card className="p-6">
        <p className="text-sm text-slate-600">Cidade não encontrada.</p>
        <div className="mt-4 flex gap-2">
          <Button variant="secondary" onClick={() => navigate("/")}>
            Ir para Home
          </Button>
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Voltar
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <HeroSection
        kicker="Cidade"
        title={`${cidade.nome} / ${cidade.uf}`}
        subtitle="Detalhes e informações gerais. Em breve: agenda local, pontos em destaque e conteúdo institucional."
        tone="primary"
        align="left"
        actions={[
          { label: "Ver eventos", href: "/eventos", variant: "primary" },
          { label: "Ver pontos turísticos", href: "/pontos-turisticos", variant: "secondary" },
          { label: "Voltar", onClick: () => navigate(-1), variant: "ghost" },
        ]}
      />

      <Card className="overflow-hidden">
        <img
          src={cidade.image}
          alt={`Foto de ${cidade.nome}`}
          className="h-64 w-full object-cover"
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG;
          }}
        />

        <div className="p-6">
          <p className="text-sm text-slate-600">
            Aqui você pode colocar conteúdo institucional da cidade, pontos em destaque, agenda local e informações úteis.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => navigate(-1)}>
              Voltar
            </Button>
            <Button variant="secondary" onClick={() => navigate("/")}>
              Home
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}