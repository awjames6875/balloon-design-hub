import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import OpenAI from "https://esm.sh/openai@4.28.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const analyzeNumberedDesign = `You are a specialized balloon cluster analyzer focused on PRECISE counting. Your task is to analyze balloon design images with numbered clusters. Follow these steps EXACTLY:

CRITICAL COUNTING RULES:
1. First, identify the color key in the bottom left/right that maps numbers to colors
2. For EACH number in the key:
   - Start from the LEFT side of the design
   - Move RIGHT systematically, row by row
   - Count ONLY clusters that have a clearly visible number matching the key
   - Mark each counted cluster (mentally) to avoid double-counting
   - Keep a running tally for each number
3. Double-check your count:
   - Repeat the count from RIGHT to LEFT
   - If counts differ, do a third count
   - Report the most consistent count
4. Verification steps:
   - Zoom in on each cluster to ensure number visibility
   - Count each numbered section separately
   - Cross-reference with the color key
5. IGNORE all decorative elements (stars, lines, etc.)

Return ONLY this JSON structure (no other text):
{
  "colorKey": {
    "1": "color_name",
    "2": "color_name"
    // ... for each numbered cluster in key
  },
  "clusters": [
    {
      "number": 1,
      "definedColor": "color_name",
      "count": number_of_occurrences
    }
    // ... for each cluster number
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
              text: "Count EVERY numbered cluster in this design. Follow the counting rules EXACTLY. Verify your count multiple times for 100% accuracy. If you're unsure about any number, mark it in your response."
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
      // Clean the response content by removing markdown code blocks if present
      const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim()
      analysisData = JSON.parse(cleanContent)
      
      // Validate response structure
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

      // Calculate total clusters
      const totalClusters = analysisData.clusters.reduce((sum, cluster) => sum + cluster.count, 0)
      console.log('Total clusters calculated:', totalClusters)
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