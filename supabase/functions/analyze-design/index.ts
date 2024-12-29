import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import OpenAI from "https://esm.sh/openai@4.28.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface BalloonCluster {
  number: number;
  color: string;
  balloons: {
    "11in": number;
    "16in": number;
  };
}

interface AnalysisResponse {
  clusters: BalloonCluster[];
  decorative: {
    silver_stars: number;
    gold_stars: number;
  };
}

const analyzeDesignPrompt = `Please analyze this balloon design image with specific attention to:
1. Identify and count each numbered cluster (#1-#4)
2. For each cluster, specify:
   - The exact color using these names only: Wild Berry, Golden Rod, Teal, Orange
   - Count balloons in the cluster
   - Identify balloon sizes (11in vs 16in balloons)
3. Count decorative elements (silver/gold stars)

Format the response as a structured JSON exactly like this:
{
  "clusters": [
    {
      "number": 1,
      "color": "Wild Berry",
      "balloons": {
        "11in": 3,
        "16in": 2
      }
    }
  ],
  "decorative": {
    "silver_stars": 2,
    "gold_stars": 1
  }
}`

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { imageUrl } = await req.json()
    console.log('Analyzing image:', imageUrl)

    if (!imageUrl) {
      throw new Error('No image URL provided')
    }

    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    })

    // Analyze the image using OpenAI's Vision API
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: analyzeDesignPrompt },
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
      max_tokens: 1000,
    })

    const content = response.choices[0].message.content
    console.log('Raw OpenAI response:', content)

    try {
      // Parse the JSON response
      const analysisData: AnalysisResponse = JSON.parse(content)
      console.log('Parsed analysis data:', analysisData)

      // Calculate total balloons and create summary
      const summary = {
        clusters: analysisData.clusters.length,
        colors: [...new Set(analysisData.clusters.map(c => c.color))],
        sizes: [
          {
            size: "11in",
            quantity: analysisData.clusters.reduce((sum, c) => sum + c.balloons["11in"], 0)
          },
          {
            size: "16in",
            quantity: analysisData.clusters.reduce((sum, c) => sum + c.balloons["16in"], 0)
          }
        ]
      }

      console.log('Analysis summary:', summary)

      return new Response(
        JSON.stringify(summary),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError)
      console.error('Raw content that failed to parse:', content)
      throw new Error('Failed to parse AI response: ' + parseError.message)
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