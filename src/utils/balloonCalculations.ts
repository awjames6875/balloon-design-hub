import { supabase } from "@/integrations/supabase/client";

interface BalloonStyle {
  style_name: string;
  density_factor: number;
}

export const calculateBaseClusters = async (length: number, style: string): Promise<number> => {
  console.log("Calculating base clusters for length:", length, "and style:", style);
  
  // Fetch the density factor from the database
  const { data: styleData, error } = await supabase
    .from("balloon_styles")
    .select("density_factor")
    .eq("style_name", style)
    .single();

  if (error) {
    console.error("Error fetching balloon style:", error);
    throw error;
  }

  if (!styleData) {
    console.error("Style not found:", style);
    throw new Error(`Balloon style '${style}' not found`);
  }

  const baseClusters = length * styleData.density_factor;
  return Math.round(baseClusters);
};

export const calculateExtraClusters = (baseClusters: number, extraPercentage: number = 0.4): number => {
  console.log("Calculating extra clusters with base clusters:", baseClusters, "and percentage:", extraPercentage);
  const extraClusters = baseClusters * extraPercentage;
  return Math.round(extraClusters);
};

export const fetchBalloonFormula = async (size: number, shape: string) => {
  console.log("Fetching formula for size:", size, "and shape:", shape);
  
  const { data, error } = await supabase
    .from("balloonformula")
    .select("*")
    .eq("size_ft", size)
    .eq("shape", shape)
    .limit(1)
    .single();

  if (error) {
    console.error("Error fetching balloon formula:", error);
    throw error;
  }

  if (!data) {
    const errorMessage = `No formula found for size ${size}ft and shape ${shape}`;
    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  console.log("Retrieved balloon formula:", data);
  return data;
};

export const calculateBalloonRequirements = async (length: number, shape: string) => {
  try {
    console.log("Calculating requirements for length:", length, "and shape:", shape);
    const formula = await fetchBalloonFormula(length, shape);
    
    // Return the database values directly
    return {
      base_clusters: formula.base_clusters,
      extra_clusters: formula.extra_clusters,
      total_clusters: formula.total_clusters,
      littles_quantity: formula.littles_quantity,
      grapes_quantity: formula.grapes_quantity,
      balloons_11in: formula.balloons_11in,
      balloons_16in: formula.balloons_16in,
      total_balloons: formula.total_balloons,
    };
  } catch (error) {
    console.error("Error calculating balloon requirements:", error);
    throw error;
  }
};