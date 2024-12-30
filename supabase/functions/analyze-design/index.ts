import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import OpenAI from "https://esm.sh/openai@4.28.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const analyzeNumberedDesign = `
You are a specialized balloon design analyzer. Your task is to analyze balloon design images and return ONLY a JSON object with the following structure, no other text:

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
      "count": number_of_clusters
    }
    // etc for each cluster number found
  ]
}

Rules:
1. Only use colors explicitly listed in the image's color key
2. Count each numbered cluster carefully
3. Return ONLY the JSON object, no explanations or other text
4. Ensure the JSON is properly formatted and valid
5. Use the exact color names from the key`

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
          content: "You are a specialized balloon design analyzer. You must respond ONLY with valid JSON, no other text."
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