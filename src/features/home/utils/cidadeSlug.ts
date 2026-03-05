import { slugify } from "../../../shared/utils/slugify";
import { useCidadesPublic } from "../../../context/cidadesStore";

/**
 * Retorna o slug oficial da cidade baseado no nome.
 * Se não encontrar na lista institucional,
 * gera via slugify como fallback.
 */
export async function getCidadeSlugByNome(nome?: string): Promise<string | null> {
  if (!nome) return null;

  const normalized = nome.trim().toLowerCase();

  // slug pode vir URL-encoded
  const {state, fetchAll} = useCidadesPublic()
  await fetchAll();
  const cidadeSelecionada = state.items.find((c) => c.slug === normalized)
  if(!cidadeSelecionada || !cidadeSelecionada.slug) return null;
  if (cidadeSelecionada) return cidadeSelecionada.slug;
  // fallback seguro
  return slugify(nome);
}
