export interface IEvento {
  id: number;
  cidadeId: number;
  cidadeSlug: string;
  nome: string;
  descricao: string;
  categoria?: string;
  dataInicio?: string;
  dataFim?: string;
  dataFormatada?: string;
  local?: string;
  imagemPrincipal?: string;
  destaque?: boolean;
}
