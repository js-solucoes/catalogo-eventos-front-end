import type { CidadeViewModel } from "./cidade";

export interface PontoTuristico {
  id: number;
  nome: string;
  tipo: string;
  horario: string;
  img: string;
  desc: string;
  cidadeId: number;
  cidade: CidadeViewModel;
}
