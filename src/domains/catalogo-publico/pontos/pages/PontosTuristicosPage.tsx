import { useMemo, useState, type ReactElement } from "react";
import { useCidadeAtual } from "@/domains/cidade-atual/useCidadeAtual";
import { useSyncCidadeFromUrl } from "@/domains/cidade-atual/useSyncCidadeFromUrl";
import { Section, SectionHeader } from "@/design-system/ui";
import { CatalogFilters } from "@/domains/catalogo-publico/shared/components/CatalogFilters";
import { CatalogGrid } from "@/domains/catalogo-publico/shared/components/CatalogGrid";
import { CatalogGridSkeleton } from "@/domains/catalogo-publico/shared/components/CatalogGridSkeleton";
import { EmptyState } from "@/domains/catalogo-publico/shared/components/EmptyState";
import { LoadMoreButton } from "@/domains/catalogo-publico/shared/components/LoadMoreButton";
import { useCatalogoPublicoPaginado } from "@/domains/catalogo-publico/shared/hooks/useCatalogoPublicoPaginado";
import type { ICatalogoFiltersValue } from "@/domains/catalogo-publico/shared/model/catalogo.filters";
import type { ICatalogoQuery } from "@/domains/catalogo-publico/shared/model/catalogo.types";
import { fetchPontosCatalogo } from "../config/pontosCatalogConfig";
import { pontosFiltersConfig } from "../config/pontosFiltersConfig";

export function PontosTuristicosPage(): ReactElement {
  useSyncCidadeFromUrl();

  const { cidade } = useCidadeAtual();
  const [filters, setFilters] = useState<ICatalogoFiltersValue>({
    busca: "",
    categoria: "",
  });

  const baseQuery: Omit<ICatalogoQuery, "page"> = useMemo(
    () => ({
      cidade: cidade.slug,
      busca: filters.busca,
      categoria: filters.categoria,
      limit: 6,
    }),
    [cidade.slug, filters.busca, filters.categoria]
  );

  const {
    data,
    isInitialLoading,
    isLoadingMore,
    error,
    loadMore,
  } = useCatalogoPublicoPaginado({
    baseQuery,
    fetcher: fetchPontosCatalogo,
  });

  const isEmpty: boolean =
    !isInitialLoading && !error && data.items.length === 0;

  return (
    <Section spacing="xl">
      <SectionHeader
        description="Descubra lugares para visitar na cidade selecionada."
      >
        Pontos turísticos em {cidade.nome}
      </SectionHeader>

      <div className="mt-8">
        <CatalogFilters
          value={filters}
          onChange={setFilters}
          config={pontosFiltersConfig}
        />
      </div>

      <div className="mt-8">
        {isInitialLoading ? <CatalogGridSkeleton count={6} /> : null}

        {error ? (
          <EmptyState
            title="Erro ao carregar pontos turísticos"
            description={error}
          />
        ) : null}

        {isEmpty ? (
          <EmptyState
            title="Nenhum ponto turístico encontrado"
            description="Tente mudar a busca, categoria ou cidade selecionada."
          />
        ) : null}

        {!isInitialLoading && !error && data.items.length > 0 ? (
          <>
            <CatalogGrid items={data.items} />

            {data.hasMore ? (
              <LoadMoreButton
                isLoading={isLoadingMore}
                onClick={loadMore}
              />
            ) : null}
          </>
        ) : null}
      </div>
    </Section>
  );
}