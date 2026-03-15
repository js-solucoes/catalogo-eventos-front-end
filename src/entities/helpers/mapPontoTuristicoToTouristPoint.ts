import type { IPontoTuristico } from "@/entities/ponto-turistico/pontoTuristico.types";
import type { ITouristPoint } from "@/entities/tourist-point/touristPoint.types";

export function mapPontoTuristicoToTouristPoint(
  ponto: IPontoTuristico
): ITouristPoint {
  return {
    id: ponto.id,
    cityId: ponto.cidadeId,
    citySlug: ponto.cidadeSlug,
    name: ponto.nome,
    description: ponto.descricao,
    category: ponto.categoria,
    address: ponto.endereco,
    openingHours: ponto.horarioFuncionamento,
    imageUrl: ponto.imagemPrincipal,
    featured: ponto.destaque ?? false,
    published: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}