import { supabase } from "@/integrations/supabase/client";

export const calculateBaseClusters = async (length: number, style: string): Promise<number> => {
  console.log("Fetching formula for length:", length, "and style:", style);
  
  const { data, error } = await supabase
    .from("balloonformula")
    .select("base_clusters")
    .eq("size_ft", length)
    .eq("shape", style)
    .maybeSingle();

  if (error) {
    console.error("Error fetching balloon formula:", error);
    throw error;
  }

  if (!data) {
    console.error(`No formula found for length ${length}ft and style ${style}`);
    throw new Error(`No formula found for length ${length}ft and style ${style}`);
  }

  return data.base_clusters;
};

export const calculateExtraClusters = async (length: number, style: string): Promise<number> => {
  const { data, error } = await supabase
    .from("balloonformula")
    .select("extra_clusters")
    .eq("size_ft", length)
    .eq("shape", style)
    .maybeSingle();

  if (error) {
    console.error("Error fetching extra clusters:", error);
    throw error;
  }

  if (!data) {
    throw new Error(`No formula found for length ${length}ft`);
  }

  return data.extra_clusters;
};

export const calculateTotalBalloons = async (length: number, style: string): Promise<{
  balloons11in: number;
  balloons16in: number;
  totalBalloons: number;
}> => {
  const { data, error } = await supabase
    .from("balloonformula")
    .select("balloons_11in, balloons_16in, total_balloons")
    .eq("size_ft", length)
    .eq("shape", style)
    .maybeSingle();

  if (error) {
    console.error("Error fetching balloon quantities:", error);
    throw error;
  }

  if (!data) {
    throw new Error(`No formula found for length ${length}ft`);
  }

  return {
    balloons11in: data.balloons_11in,
    balloons16in: data.balloons_16in,
    totalBalloons: data.total_balloons
  };
};

export const estimateProductionTime = async (length: number, style: string): Promise<string> => {
  const { data, error } = await supabase
    .from("balloonformula")
    .select("total_clusters")
    .eq("size_ft", length)
    .eq("shape", style)
    .maybeSingle();

  if (error) {
    console.error("Error fetching total clusters:", error);
    throw error;
  }

  if (!data) {
    throw new Error(`No formula found for length ${length}ft`);
  }

  // Calculate production time based on 15 minutes per cluster
  const totalMinutes = data.total_clusters * 15;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  return `${hours}h ${minutes}m`;
};

export const calculateBalloonRequirements = async (length: number, style: string) => {
  console.log("Calculating requirements for length:", length, "and style:", style);
  
  const { data, error } = await supabase
    .from("balloonformula")
    .select("*")
    .eq("size_ft", length)
    .eq("shape", style)
    .maybeSingle();

  if (error) {
    console.error("Error fetching balloon formula:", error);
    throw error;
  }

  if (!data) {
    throw new Error(`No formula found for length ${length}ft and style ${style}`);
  }

  return {
    base_clusters: data.base_clusters,
    extra_clusters: data.extra_clusters,
    total_clusters: data.total_clusters,
    littles_quantity: data.littles_quantity,
    grapes_quantity: data.grapes_quantity,
    balloons_11in: data.balloons_11in,
    balloons_16in: data.balloons_16in,
    total_balloons: data.total_balloons,
  };
};