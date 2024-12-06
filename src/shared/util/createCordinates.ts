export type PointGeometry = {
  type: 'Point';
  coordinates: [number, number];
};

export function createLocationCoordinates(
  longitude: number,
  latitude: number,
): PointGeometry {
  return {
    type: 'Point' as const,
    coordinates: [longitude, latitude] as [number, number],
  };
}
