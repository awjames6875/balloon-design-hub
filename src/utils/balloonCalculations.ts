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
}

export interface CalculationResult {
  formula: BalloonFormula;
  baseClusters: number;
  extraClusters: number;
  totalBalloons: number;
}

export const fetchBalloonFormula = async (size: number): Promise<BalloonFormula | null> => {
  const { data, error } = await supabase
    .from('balloonformula')
    .select('*')
    .eq('size_ft', size)
    .maybeSingle();

  if (error) {
    console.error('Error fetching balloon formula:', error);
    throw error;
  }

  return data;
};

export const calculateBalloonRequirements = async (size: number): Promise<CalculationResult | null> => {
  const formula = await fetchBalloonFormula(size);
  
  if (!formula) {
    return null;
  }

  return {
    formula,
    baseClusters: formula.base_clusters,
    extraClusters: formula.extra_clusters,
    totalBalloons: formula.total_balloons,
  };
};