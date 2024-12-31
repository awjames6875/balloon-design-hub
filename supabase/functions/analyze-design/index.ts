import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import OpenAI from "https://esm.sh/openai@4.28.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const analyzeNumberedDesign = `You are a specialized balloon cluster analyzer. Your task is to analyze the image and return ONLY a JSON object with cluster counts and calculations.

RULES FOR ANALYSIS:
1. Find the color key in the bottom left corner
2. For each numbered color in the key:
   - Count matching clusters in the image
   - Each cluster has 11 small (11-inch) and 2 large (16-inch) balloons
3. Count each cluster twice for accuracy
4. Only count clusters with visible numbers
5. Ignore all decorative elements
6. Use exact color names from the key

YOU MUST RETURN ONLY THIS JSON STRUCTURE, NO OTHER TEXT:
{
  "colorKey": {
    "1": "exact_color_from_key",
    "2": "exact_color_from_key"
  },
  "clusters": [
    {
      "number": 1,
      "definedColor": "exact_color_from_key",
      "count": number_of_clusters
    }
  ]
}`

serve(async (req) => {
  // Handle CORS preflight requests
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
          content: "You are a JSON-only response system. You must return ONLY a valid JSON object matching the specified structure. No explanations, no text, just the JSON object."
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
      response_format: { type: "json_object" },
      max_tokens: 1000,
    })

    const content = response.choices[0].message.content
    console.log('Raw analysis:', content)

    try {
      const analysisData = JSON.parse(content)
      
      // Validate the response structure
      if (!analysisData || typeof analysisData !== 'object') {
        throw new Error('Invalid analysis format: not an object')
      }

      if (!analysisData.colorKey || typeof analysisData.colorKey !== 'object') {
        throw new Error('Invalid analysis format: missing or invalid colorKey')
      }

      if (!analysisData.clusters || !Array.isArray(analysisData.clusters)) {
        throw new Error('Invalid analysis format: missing or invalid clusters array')
      }

      // Validate each cluster
      analysisData.clusters.forEach((cluster: any, index: number) => {
        if (!cluster.number || !cluster.definedColor || typeof cluster.count !== 'number') {
          throw new Error(`Invalid cluster format at index ${index}`)
        }
      })

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