interface AnalysisResponse {
  totalClusters: number;
  analysis: string;
  error?: string;
}

const createErrorResponse = (message: string): AnalysisResponse => ({
  totalClusters: 0,
  analysis: '',
  error: message
});

const ANALYSIS_PROMPT = `Analyze the balloon design with the following criteria:
- Color combinations
- Pattern complexity
- Estimated assembly time`;

export const handler = async (req: Request): Promise<Response> => {
  try {
    const { design } = await req.json();
    
    if (!design) {
      return new Response(
        JSON.stringify(createErrorResponse('Design data is required')),
        { status: 400 }
      );
    }

    const clusters = design.elements?.length || 0;
    const analysis = `${ANALYSIS_PROMPT}\nTotal clusters: ${clusters}`;

    return new Response(
      JSON.stringify({ totalClusters: clusters, analysis }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify(createErrorResponse('Failed to analyze design')),
      { status: 500 }
    );
  }
};