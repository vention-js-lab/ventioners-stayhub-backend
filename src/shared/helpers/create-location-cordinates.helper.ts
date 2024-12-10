export type PointGeometry = {
  type: 'Point';
  coordinates: [number, number];
};

export function createLocationCoordinates(
  latitude: number,
  longitude: number,
): PointGeometry {
  return {
    type: 'Point' as const,
    coordinates: [latitude, longitude] as [number, number],
  };
}
