export interface BalloonDensityData {
  Style: string;
  Density: number;
}

export const balloonDensityData: BalloonDensityData[] = [
  { Style: "Straight", Density: 0.5 },
  { Style: "Curved", Density: 0.6 },
  { Style: "Cluster", Density: 0.8 },
];

export const calculateRequiredStock = (quantity: number, style: string): number => {
  const densityInfo = balloonDensityData.find((item) => item.Style === style);
  return Math.ceil(quantity / (densityInfo?.Density || 1));
};