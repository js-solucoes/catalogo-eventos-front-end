import type { ICityApiResponse } from "./contracts/city.contracts";
import type { IEventoApiResponse } from "./contracts/evento.contracts";
import type { IPontoTuristicoApiResponse } from "./contracts/pontoTuristico.contracts";

export const cidadesMock: ICityApiResponse[] = [
  {
    id: "dourados",
    name: "Dourados",
    slug: "dourados",
    state: "MS",
    description: "Centro regional com forte vida cultural e turística.",
    imageUrl: "/images/cidades/dourados.jpg",
    summary: "",
    published: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "itapora",
    name: "Itaporã",
    slug: "itapora",
    state: "MS",
    description: "Cidade conectada ao território do Celeiro do MS.",
    imageUrl: "/images/cidades/itapora.jpg",
    summary: "",
    published: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const eventosMock: IEventoApiResponse[] = [
  {
    id: "evt-1",
    cidade_id: "dourados",
    cidade_slug: "dourados",
    nome: "Festival Gastronômico de Dourados",
    descricao: "Sabores regionais, música e experiências culturais.",
    categoria: "Gastronomia",
    data_inicio: "2026-03-20",
    data_fim: "2026-03-22",
    data_formatada: "20 a 22 de março de 2026",
    local: "Parque dos Ipês",
    imagem_principal: "/images/highlights/festival-gastronomico.jpg",
    destaque: true,
  },
];
export const pontosMock: IPontoTuristicoApiResponse[] = [
  {
    id: "pto-1",
    cidade_id: "dourados",
    cidade_slug: "dourados",
    nome: "Parque Antenor Martins",
    descricao: "Área verde com lago, pista de caminhada e espaço de lazer.",
    categoria: "Natureza",
    endereco: "Rua Antônio Emílio de Figueiredo",
    horario_funcionamento: "Todos os dias",
    imagem_principal: "/images/highlights/parque-antenor-martins.jpg",
    destaque: true,
  },
];

export async function mockDelay(delayMs: number = 250): Promise<void> {
  await new Promise<void>((resolve: () => void) => {
    window.setTimeout(resolve, delayMs);
  });
}
