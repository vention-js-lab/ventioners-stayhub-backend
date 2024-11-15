export function parseCorsOrigins(origins: string): string[] {
  if (!origins) return [];

  return origins.split(',').map((origin) => origin.trim());
}
