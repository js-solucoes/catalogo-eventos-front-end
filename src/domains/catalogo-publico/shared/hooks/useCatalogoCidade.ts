import { useCallback, useMemo, type ChangeEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { ICity } from "@/entities/city/city.types";
import { CELEIRO_CITIES } from "@/domains/home-institucional/data/celeiroCities";

const DEFAULT_CIDADE_SLUG = "dourados";

interface IUseCatalogoCidadeResult {
  cidadeSlug: string;
  cidadeNome: string;
  cidades: ICity[];
  handleCidadeChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  setCidadeSlug: (slug: string) => void;
}

function isCidadeValida(slug: string): boolean {
  return CELEIRO_CITIES.some((cidade: ICity) => cidade.slug === slug);
}

function getCidadeBySlug(slug: string): ICity | undefined {
  return CELEIRO_CITIES.find((cidade: ICity) => cidade.slug === slug);
}

export function useCatalogoCidade(): IUseCatalogoCidadeResult {
  const [searchParams, setSearchParams] = useSearchParams();

  const cidadeSlug: string = useMemo(() => {
    const slugFromUrl: string | null = searchParams.get("cidade");

    if (!slugFromUrl) {
      return DEFAULT_CIDADE_SLUG;
    }

    return isCidadeValida(slugFromUrl) ? slugFromUrl : DEFAULT_CIDADE_SLUG;
  }, [searchParams]);

  const cidadeNome: string = useMemo(() => {
    const cidade: ICity | undefined = getCidadeBySlug(cidadeSlug);
    return cidade?.name ?? "Dourados";
  }, [cidadeSlug]);

  const setCidadeSlug = useCallback(
    (slug: string): void => {
      const nextSlug: string = isCidadeValida(slug) ? slug : DEFAULT_CIDADE_SLUG;
      const nextParams: URLSearchParams = new URLSearchParams(searchParams);
      nextParams.set("cidade", nextSlug);
      setSearchParams(nextParams, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  const handleCidadeChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>): void => {
      setCidadeSlug(event.target.value);
    },
    [setCidadeSlug]
  );

  return {
    cidadeSlug,
    cidadeNome,
    cidades: CELEIRO_CITIES,
    handleCidadeChange,
    setCidadeSlug,
  };
}