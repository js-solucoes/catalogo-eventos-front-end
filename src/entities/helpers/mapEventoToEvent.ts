import type { IEvento } from "@/entities/evento/evento.types";
import type { IEvent } from "@/entities/event/event.types";

export function mapEventoToEvent(evento: IEvento): IEvent {
  return {
    id: evento.id,
    cityId: evento.cidadeId,
    citySlug: evento.cidadeSlug,
    name: evento.nome,
    description: evento.descricao,
    category: evento.categoria,
    startDate: evento.dataInicio,
    endDate: evento.dataFim,
    formattedDate: evento.dataFormatada,
    location: evento.local,
    imageUrl: evento.imagemPrincipal,
    featured: evento.destaque ?? false,
    published: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}