import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import OpenAI from "https://esm.sh/openai@4.28.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const analyzeNumberedDesign = `You are a specialized balloon cluster analyzer. Your task is to analyze this balloon design image and identify numbered clusters and their colors. Return ONLY a JSON object with the following structure. DO NOT include any other text.

ANALYSIS RULES:
1. Look for the color key in the bottom left that maps numbers to colors
2. For each numbered cluster in the key:
   - Count EVERY SINGLE instance of that numbered cluster in the design
   - Each cluster consists of 11 (11-inch) + 2 (16-inch) balloons
   - Count clusters ONLY if they have a visible number matching the key
3. Double-check your count:
   - Look at the design from left to right
   - Count each numbered cluster individually
   - Verify your count by doing a second pass from right to left
4. Ignore all decorative elements (stars, lines, etc.)
5. Triple verify all counts before responding

RETURN THIS EXACT JSON STRUCTURE:
{
  "colorKey": {
    "1": "color_name",
    "2": "color_name"
    // ... for each numbered cluster found
  },
  "clusters": [
    {
      "number": 1,
      "definedColor": "color_name",
      "count": number_of_occurrences
    }
    // ... for each cluster number found
  ]
}`

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { imageUrl } = await req.json()
    console.log('Analyzing design image:', imageUrl)

    if (!imageUrl) {
      throw new Error('No image URL provided')
    }

    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY')
    })

    console.log('Sending request to OpenAI...')
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "system",
          content: analyzeNumberedDesign
        },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: imageUrl,
                detail: "high"
              }
            },
            {
              type: "text",
              text: "Please count EVERY SINGLE numbered cluster in this design. Make sure to verify your count multiple times for 100% accuracy."
            }
          ]
        }
      ],
      max_tokens: 1000
    })

    const content = response.choices[0].message.content
    console.log('Raw OpenAI response:', content)

    let analysisData
    try {
      // Remove any potential markdown code block markers
      const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim()
      analysisData = JSON.parse(cleanContent)
      
      // Validate the response structure
      if (!analysisData?.colorKey || !analysisData?.clusters || !Array.isArray(analysisData.clusters)) {
        console.error('Invalid response structure:', analysisData)
        throw new Error('Invalid response structure')
      }

      // Validate each cluster has required properties
      for (const cluster of analysisData.clusters) {
        if (!('number' in cluster && 'definedColor' in cluster && 'count' in cluster)) {
          console.error('Invalid cluster structure:', cluster)
          throw new Error('Invalid cluster structure')
        }
      }

      // Calculate total clusters by summing the count of all clusters
      const totalClusters = analysisData.clusters.reduce((sum, cluster) => sum + cluster.count, 0)
      console.log('Total clusters calculated:', totalClusters)

      // Update the response to include the total count
      analysisData.totalClusters = totalClusters

    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError)
      console.log('Content that failed to parse:', content)
      throw new Error('Failed to parse analysis response')
    }

    console.log('Processed analysis data:', analysisData)
    return new Response(
      JSON.stringify(analysisData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in analyze-design function:', error)
    return new Response(
      JSON.stringify({
        error: error.message,
        details: 'Failed to analyze design image'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})