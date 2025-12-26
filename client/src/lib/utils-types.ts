/**
 * Converte um valor para número com segurança
 * Retorna 0 se o valor não puder ser convertido
 */
export function toNumber(value: unknown): number {
  if (value === null || value === undefined) return 0;
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
}

/**
 * Formata um valor numérico como moeda brasileira
 */
export function formatCurrency(value: unknown): string {
  const num = toNumber(value);
  return `R$ ${(num / 100).toLocaleString("pt-BR", { minimumFractionDigits: 0 })}`;
}

/**
 * Formata um valor numérico como moeda brasileira com "/mês"
 */
export function formatRent(value: unknown): string {
  const num = toNumber(value);
  return `R$ ${(num / 100).toLocaleString("pt-BR", { minimumFractionDigits: 0 })}/mês`;
}

/**
 * Converte um timestamp para Date com segurança
 */
export function toDate(value: unknown): Date | null {
  if (value === null || value === undefined) return null;
  if (value instanceof Date) return value;
  if (typeof value === "string" || typeof value === "number") {
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
  }
  return null;
}

/**
 * Calcula dias desde uma data
 */
export function daysSince(date: unknown): number {
  const d = toDate(date);
  if (!d) return 0;
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}
