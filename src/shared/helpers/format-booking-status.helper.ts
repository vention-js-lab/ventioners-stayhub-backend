export function formatBookingStatus(status: string): string {
  return status
    .toLowerCase()
    .replace(/_/, ' ')
    .replace(/^\w/, (c) => c.toUpperCase());
}
