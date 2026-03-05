import React, { useCallback, useMemo, useState } from "react";
import {
  findCidadeById,
  findEventById,
  listEventos,
  type SortDir,
} from "../bff/appBff";
import {
  EventosContext,
  type EventosContextValue,
  initialEventosState,
} from "./eventosStore";

export type EventosQuery = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDir?: SortDir;
};

export const EventosProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [state, setState] = useState(initialEventosState);
  const [query, setQuery] = useState<EventosQuery>({
    page: 1,
    limit: 12,
    sortBy: "data",
    sortDir: "asc",
  });

  const fetchFirstPage = useCallback(
    async (q?: Omit<EventosQuery, "page">) => {
      const nextQuery: EventosQuery = { ...query, ...q, page: 1 };

      setQuery(nextQuery);
      setState((s) => ({ ...s, loading: true, error: null }));

      try {
        const res = await listEventos({
          page: nextQuery.page ?? 1,
          limit: nextQuery.limit ?? 12,
          sortBy: nextQuery.sortBy ?? "data",
          sortDir: nextQuery.sortDir ?? "asc",
        });

        const cidade = await findCidadeById(res.items[0].cidadeId);

        setState({
          items: res.items,
          page: res.page,
          totalPages: res.totalPages,
          total: res.total,
          loading: false,
          error: null,
          cidade: cidade,
        });
      } catch (e) {
        console.error(e);
        setState((s) => ({
          ...s,
          loading: false,
          error: "Não foi possível carregar eventos.",
        }));
      }
    },
    [query],
  );

  const findById = useCallback(async (id: number) => {
    try {
      setState((s) => ({
        ...s,
        loading: true,
        error: null,
      }));
      const item = await findEventById(id);
      const cidadeEvt = await findCidadeById(id);
      setState((s) => ({
        ...s,
        eventoSelecionado: item,
        cidade: cidadeEvt,
        loading: false,
        error: null,
      }));
    } catch (error) {
      console.error(error);
      setState((s) => ({
        ...s,
        loading: false,
        error: "Não foi possível carregar pontos turísticos.",
      }));
    } finally {
      setState((s) => ({
        ...s,
        loading: false,
        error: null,
      }));
    }
  }, []);

  const findCidadeEvento = useCallback(async (id: number) => {
    try {
      setState((s) => ({
        ...s,
        loading: true,
        error: null,
      }));
      const cidadeEvt = await findCidadeById(id);
      setState((s) => ({
        ...s,
        cidade: cidadeEvt,
        loading: false,
        error: null,
      }));
    } catch (error) {
      console.error(error);
      setState((s) => ({
        ...s,
        loading: false,
        error: "Não foi possível carregar esse evento.",
      }));
    } finally {
      setState((s) => ({
        ...s,
        loading: false,
        error: null,
      }));
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (state.loading) return;
    if (state.page >= state.totalPages) return;

    const nextPage = state.page + 1;
    setState((s) => ({ ...s, loading: true, error: null }));

    try {
      const res = await listEventos({
        page: nextPage,
        limit: query.limit ?? 12,
        sortBy: query.sortBy ?? "data",
        sortDir: query.sortDir ?? "asc",
      });

      setState((s) => ({
        items: [...s.items, ...res.items],
        page: res.page,
        totalPages: res.totalPages,
        total: res.total,
        loading: false,
        error: null,
      }));
    } catch (e) {
      console.error(e);
      setState((s) => ({
        ...s,
        loading: false,
        error: "Não foi possível carregar mais eventos.",
      }));
    }
  }, [state.loading, state.page, state.totalPages, query]);

  const value = useMemo<EventosContextValue>(
    () => ({
      state,
      query,
      fetchFirstPage,
      loadMore,
      setQuery,
      findById,
      findCidadeEvento,
    }),
    [state, query, fetchFirstPage, loadMore],
  );

  return (
    <EventosContext.Provider value={value}>{children}</EventosContext.Provider>
  );
};
