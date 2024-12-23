import { supabase } from "@/integrations/supabase/client";

export interface BalloonFormula {
  id: number;
  size_ft: number;
  base_clusters: number;
  extra_clusters: number;
  total_clusters: number;
  littles_quantity: number;
  grapes_quantity: number;
  balloons_11in: number;
  balloons_16in: number;
  total_balloons: number;
  shape: string;
  shape_multiplier: number;
}

export interface CalculationResult {
  formula: BalloonFormula;
  baseClusters: number;
  extraClusters: number;
  totalClusters: number;
  littlesQuantity: number;
  grapesQuantity: number;
  balloons11in: number;
  balloons16in: number;
  totalBalloons: number;
}

export const fetchBalloonFormula = async (size: number, shape: string): Promise<BalloonFormula | null> => {
  const { data, error } = await supabase
    .from('balloonformula')
    .select('*')
    .eq('size_ft', size)
    .eq('shape', shape)
    .maybeSingle();

  if (error) {
    console.error('Error fetching balloon formula:', error);
    throw error;
  }

  return data;
};

export const calculateBalloonRequirements = async (size: number, shape: string): Promise<CalculationResult | null> => {
  const formula = await fetchBalloonFormula(size, shape);
  
  if (!formula) {
    return null;
  }

  const multiplier = formula.shape_multiplier || 1;

  return {
    formula,
    baseClusters: Math.round(formula.base_clusters * multiplier),
    extraClusters: Math.round(formula.extra_clusters * multiplier),
    totalClusters: Math.round(formula.total_clusters * multiplier),
    littlesQuantity: Math.round(formula.littles_quantity * multiplier),
    grapesQuantity: Math.round(formula.grapes_quantity * multiplier),
    balloons11in: Math.round(formula.balloons_11in * multiplier),
    balloons16in: Math.round(formula.balloons_16in * multiplier),
    totalBalloons: Math.round(formula.total_balloons * multiplier),
  };
};