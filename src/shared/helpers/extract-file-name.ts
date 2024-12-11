export function extractFileNameFromUrl(url: string): string {
  if (!url) return '';
  const segments = url.split('/');
  return segments.pop() || '';
}
