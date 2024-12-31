export type CorrectionType = 
  | 'cluster_count' 
  | 'color_name' 
  | 'balloon_count' 
  | 'add_color' 
  | 'remove_color';

export interface CorrectionProps {
  type: CorrectionType;
  color: string;
  originalValue: string | number | null;
  newValue: string | number;
  action: string;
  balloonSize?: '11' | '16';
  clusterCount?: number;
}

export interface BalloonGeniProps {
  onUpdate: (correction: CorrectionProps) => Promise<void>;
  colorClusters?: Array<{
    color: string;
    baseClusters: number;
    extraClusters: number;
  }>;
  onClustersUpdate?: (newClusters: Array<{
    color: string;
    baseClusters: number;
    extraClusters: number;
  }>) => void;
}