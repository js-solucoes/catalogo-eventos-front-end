import { ICity } from "@/entities/city/city.types";
import { IEvent } from "@/entities/event/event.types";
import { ITouristPoint } from "@/entities/tourist-point/touristPoint.types";

export interface IListByCidadeParams {
  cidade: string;
  page: number;
  limit: number;
  busca?: string;
  categoria?: string;
}

export interface ITourismApiListResponse<TItem> {
  items: TItem[];
  page: number;
  limit: number;
  total: number;
}

export interface ITourismApiClient {
  listCidades: () => Promise<ICity[]>;
  listEventosByCidade: (
    params: IListByCidadeParams
  ) => Promise<ITourismApiListResponse<IEvent>>;
  listPontosByCidade: (
    params: IListByCidadeParams
  ) => Promise<ITourismApiListResponse<ITouristPoint>>;
  getEventoById: (id: string) => Promise<IEvent | null>;
  getPontoById: (id: string) => Promise<ITouristPoint | null>;
}