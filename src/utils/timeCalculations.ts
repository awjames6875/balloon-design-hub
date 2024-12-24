export const calculateInflationTime = (totalClusters: number): string => {
  const minutesPerCluster = 5;
  const totalMinutes = totalClusters * minutesPerCluster;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
};