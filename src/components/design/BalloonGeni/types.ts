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
  balloonSize?: '11' | '16';  // For balloon-specific updates
  clusterCount?: number;      // For tracking cluster counts
}

export interface BalloonGeniProps {
  onUpdate: (correction: CorrectionProps) => Promise<void>;
}