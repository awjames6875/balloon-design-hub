import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import OpenAI from "https://esm.sh/openai@4.28.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const analyzeDesignPrompt = `You are a balloon design expert. Analyze this balloon garland design image with extreme precision and provide a detailed JSON response.

Focus specifically on:
1. Count and identify EACH numbered cluster (#1, #2, #3, etc.)
2. For each cluster found:
   - Record its number identifier
   - Note its position (left, center, right, top, bottom)
   - Count how many times this specific cluster appears
   - Identify its color

Return ONLY a JSON object with this exact structure:
{
  "clusters": [
    {
      "number": 2,
      "appearances": 3,
      "positions": ["left-top", "center", "right-bottom"],
      "color": "Golden Rod"
    }
  ],
  "total_cluster_count": 12
}

Be extremely thorough and methodical in your count. Double-check each cluster identification.`

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { imageUrl } = await req.json()
    console.log('Analyzing image for clusters:', imageUrl)

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
    console.log('Raw cluster analysis:', content)

    try {
      const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim()
      const analysisData = JSON.parse(cleanContent)
      
      // Validate the response structure
      if (!analysisData.clusters || !Array.isArray(analysisData.clusters)) {
        throw new Error('Invalid cluster analysis format')
      }

      console.log('Processed cluster analysis:', analysisData)

      return new Response(
        JSON.stringify(analysisData),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } catch (parseError) {
      console.error('Error parsing cluster analysis:', parseError)
      console.error('Raw content that failed to parse:', content)
      throw new Error('Failed to parse cluster analysis: ' + parseError.message)
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