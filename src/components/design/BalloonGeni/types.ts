// Define all possible correction types
export type CorrectionType = 
  | 'cluster_count' 
  | 'color_name' 
  | 'balloon_count' 
  | 'add_color' 
  | 'remove_color';

// Interface for handling corrections
export interface CorrectionProps {
  type: CorrectionType;
  color: string;
  originalValue: string | number | null;
  newValue: string | number;
  action: string;
  balloonSize?: '11' | '16';  // For balloon-specific updates
  clusterCount?: number;      // For tracking cluster counts
}

// Props for the BalloonGeni component
export interface BalloonGeniProps {
  onUpdate: (correction: CorrectionProps) => Promise<void>;
}