import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import OpenAI from "https://esm.sh/openai@4.28.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const analyzeNumberedDesign = `
Analyze this balloon design by following these exact steps:

1. FIRST - Read the numbered color key at the bottom of the image:
   - Record each number and its EXACT corresponding color name
   - Only use colors explicitly listed in the key
   - Do not attempt to interpret or guess any colors

2. THEN - Count clusters in the design:
   - Look for numbered clusters (#1, #2, #3, etc.)
   - Match each cluster's number to the color key
   - Record the quantity of each numbered cluster

3. Format response to show:
   - Total count of each numbered cluster
   - Use ONLY the exact color names from the key
   - Match numbers to their defined colors

Example response format:
{
  "colorKey": {
    "1": "Wild Berry",
    "2": "Golden Rod",
    "3": "Teal",
    "4": "Orange"
  },
  "clusters": [
    {
      "number": 1,
      "definedColor": "Wild Berry",
      "count": X
    }
  ]
}

IMPORTANT: Never guess colors. Only use colors explicitly defined in the key.`

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
      max_tokens: 1000,
    })

    const content = response.choices[0].message.content
    console.log('Raw analysis:', content)

    try {
      const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim()
      const analysisData = JSON.parse(cleanContent)
      
      // Validate the response structure
      if (!analysisData.colorKey || !analysisData.clusters || !Array.isArray(analysisData.clusters)) {
        throw new Error('Invalid analysis format')
      }

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