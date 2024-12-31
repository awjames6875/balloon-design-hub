import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import OpenAI from "https://esm.sh/openai@4.28.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const analyzeNumberedDesign = `You are a specialized balloon cluster analyzer. Your task is to analyze this balloon design image and identify numbered clusters and their colors. Return ONLY a JSON object with the following structure. DO NOT include any other text.

ANALYSIS RULES:
1. Look for numbered clusters in the image (numbers that indicate balloon groupings)
2. For each numbered cluster, identify its color
3. Count how many times each numbered cluster appears
4. Create a mapping between cluster numbers and their colors

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
            }
          ]
        }
      ],
      max_tokens: 1000
    })

    const content = response.choices[0].message.content
    console.log('Raw OpenAI response:', content)

    // Parse and validate the response
    let analysisData
    try {
      analysisData = JSON.parse(content)
    } catch (error) {
      console.error('Failed to parse OpenAI response:', error)
      throw new Error('Failed to parse analysis response')
    }

    // Validate the response structure
    if (!analysisData?.colorKey || !analysisData?.clusters || !Array.isArray(analysisData.clusters)) {
      console.log('Invalid response structure, providing default response')
      return new Response(
        JSON.stringify({
          colorKey: { "1": "white" },
          clusters: [{ number: 1, definedColor: "white", count: 1 }]
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
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