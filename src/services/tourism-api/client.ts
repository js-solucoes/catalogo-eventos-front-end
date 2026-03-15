import { toEventoEntity } from "./adapters/evento.adapters";
import { toPontoTuristicoEntity } from "./adapters/pontoTuristico.adapters";
import { cidadesMock, eventosMock, mockDelay, pontosMock } from "./mock-data";
import type {
  IListByCidadeParams,
  ITourismApiClient,
  ITourismApiListResponse,
} from "./tourismApi.types";
import { mapEventoToEvent } from "@/entities/helpers/mapEventoToEvent";
import { IEvent } from "@/entities/event/event.types";
import { mapPontoTuristicoToTouristPoint } from "@/entities/helpers/mapPontoTuristicoToTouristPoint";
import { ITouristPoint } from "@/entities/tourist-point/touristPoint.types";
import { ICity } from "@/entities/city/city.types";

function paginateItems<TItem>(
  items: TItem[],
  page: number,
  limit: number
): ITourismApiListResponse<TItem> {
  const safePage: number = page > 0 ? page : 1;
  const safeLimit: number = limit > 0 ? limit : 12;
  const startIndex: number = (safePage - 1) * safeLimit;
  const endIndex: number = startIndex + safeLimit;

  return {
    items: items.slice(startIndex, endIndex),
    total: items.length,
    page: safePage,
    limit: safeLimit,
  };
}

function includesNormalizedValue(
  sourceValue: string | undefined,
  targetValue: string | undefined
): boolean {
  if (!targetValue) {
    return true;
  }

  if (!sourceValue) {
    return false;
  }

  return sourceValue.toLowerCase().includes(targetValue.toLowerCase());
}

export const tourismApiClient: ITourismApiClient = {
  async listCidades(): Promise<ICity[]> {
    await mockDelay();
    return cidadesMock;
  },

  async listEventosByCidade(
    params: IListByCidadeParams
  ): Promise<ITourismApiListResponse<IEvent>> {
    await mockDelay();

    const filteredItems = eventosMock.filter((item) => {
      const matchesCidade: boolean = item.cidade_slug === params.cidade;
      const matchesBusca: boolean = includesNormalizedValue(item.nome, params.busca);
      const matchesCategoria: boolean =
        !params.categoria || item.categoria === params.categoria;

      return matchesCidade && matchesBusca && matchesCategoria;
    });

    const mappedItems: IEvent[] = filteredItems.map(toEventoEntity).map(mapEventoToEvent);

    return paginateItems(mappedItems, params.page, params.limit);
  },

  async listPontosByCidade(
    params: IListByCidadeParams
  ): Promise<ITourismApiListResponse<ITouristPoint>> {
    await mockDelay();

    const filteredItems = pontosMock.filter((item) => {
      const matchesCidade: boolean = item.cidade_slug === params.cidade;
      const matchesBusca: boolean = includesNormalizedValue(item.nome, params.busca);
      const matchesCategoria: boolean =
        !params.categoria || item.categoria === params.categoria;

      return matchesCidade && matchesBusca && matchesCategoria;
    });

    const mappedItems: ITouristPoint[] = filteredItems.map(
      toPontoTuristicoEntity
    ).map(mapPontoTuristicoToTouristPoint);

    return paginateItems(mappedItems, params.page, params.limit);
  },

  async getEventoById(id: string): Promise<IEvent | null> {
    await mockDelay(180);

    const foundItem = eventosMock.find((item) => item.id === id);

    if (!foundItem) {
      return null;
    }

    return mapEventoToEvent(toEventoEntity(foundItem));
  },

  async getPontoById(id: string): Promise<ITouristPoint | null> {
    await mockDelay(180);

    const foundItem = pontosMock.find((item) => item.id === id);

    if (!foundItem) {
      return null;
    }

    return mapPontoTuristicoToTouristPoint(toPontoTuristicoEntity(foundItem));
  },
};