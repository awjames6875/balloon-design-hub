import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import OpenAI from "https://esm.sh/openai@4.28.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const analyzeNumberedDesign = `
LOVABLE.AI BALLOON CLUSTER ANALYSIS

STEP 1: KEY VERIFICATION
1. Locate and read the color key in the bottom left corner
2. Identify each color and its corresponding cluster number

STEP 2: COLOR ANALYSIS
For each color in the key:
- Count matching numbered clusters in the image
- Verify balloon colors match the key
- Each cluster should have:
  * 11 balloons (11-inch size)
  * 2 balloons (16-inch size)

STEP 3: CALCULATE TOTALS
Calculate for each color and overall:
- Number of clusters
- Total 11-inch balloons (clusters × 11)
- Total 16-inch balloons (clusters × 2)

IMPORTANT RULES:
1. Only count clusters with visible numbers
2. Count each cluster twice for accuracy
3. Ignore decorative elements (stars, lines, etc.)
4. Only use colors from the key
5. Report exact color names as shown in key

Your response must be ONLY a JSON object with this exact structure:

{
  "colorKey": {
    "1": "color_name",
    "2": "color_name"
    // etc for each numbered color in the key
  },
  "clusters": [
    {
      "number": 1,
      "definedColor": "exact_color_from_key",
      "count": number_of_clusters,
      "balloons11inch": number_of_11inch,
      "balloons16inch": number_of_16inch
    }
    // etc for each cluster number found
  ],
  "totals": {
    "totalClusters": number,
    "total11inch": number,
    "total16inch": number,
    "totalBalloons": number
  }
}

Return ONLY the JSON object, no other text or explanations.`

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { imageUrl } = await req.json()
    console.log('Analyzing numbered design:', imageUrl)

    if (!imageUrl) {
      throw new Error('No image URL provided')
    }

    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    })

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a specialized balloon cluster analyzer. You must respond ONLY with valid JSON following the exact structure specified. Focus exclusively on counting numbered clusters, matching them to the color key, and calculating balloon quantities."
        },
        {
          role: "user",
          content: [
            { type: "text", text: analyzeNumberedDesign },
            {
              type: "image_url",
              image_url: {
                url: imageUrl,
                detail: "high"
              }
            }
          ],
        },
      ],
      response_format: { type: "json_object" }, // Force JSON response
      max_tokens: 1000,
    })

    const content = response.choices[0].message.content
    console.log('Raw analysis:', content)

    try {
      // Parse the response to ensure it's valid JSON
      const analysisData = JSON.parse(content)
      
      // Validate the response structure
      if (!analysisData.colorKey || !analysisData.clusters || !Array.isArray(analysisData.clusters)) {
        throw new Error('Invalid analysis format')
      }

      // Log the processed analysis for debugging
      console.log('Processed analysis:', analysisData)

      return new Response(
        JSON.stringify(analysisData),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } catch (parseError) {
      console.error('Error parsing analysis:', parseError)
      console.error('Raw content that failed to parse:', content)
      throw new Error('Failed to parse analysis: ' + parseError.message)
    }
  } catch (error) {
    console.error('Error in analyze-design function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})