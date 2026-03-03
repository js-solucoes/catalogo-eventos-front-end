import type { Evento } from "./evento";
import type { PontoTuristico } from "./pontoTuristico";

export interface CidadeViewModel {
  id: string;
  nome: string;
  uf: string;
  desc: string;
  pontosTuristicos: PontoTuristico[];
  eventos: Evento[];
}


