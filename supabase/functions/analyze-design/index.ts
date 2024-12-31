import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import OpenAI from "https://esm.sh/openai@4.28.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const analyzeNumberedDesign = `You are a specialized balloon cluster analyzer. Analyze this balloon design image and return ONLY a JSON object with the following structure. DO NOT include any other text.

ANALYSIS RULES:
1. Look for numbered clusters in the image
2. Each number represents a cluster of balloons
3. Each cluster should have a defined color
4. Count total occurrences of each numbered cluster
5. Create a color key mapping numbers to colors

RETURN THIS EXACT JSON STRUCTURE:
{
  "colorKey": {
    "1": "color_name",
    "2": "color_name"
  },
  "clusters": [
    {
      "number": 1,
      "definedColor": "color_name",
      "count": number_of_occurrences
    }
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
      model: "gpt-4o",
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
      response_format: { type: "json_object" },
      max_tokens: 1000
    })

    const content = response.choices[0].message.content
    console.log('Raw OpenAI response:', content)

    // Parse and validate the response
    const analysisData = JSON.parse(content)
    
    // Provide default data if no clusters are detected
    if (!analysisData.colorKey || !analysisData.clusters || analysisData.clusters.length === 0) {
      console.log('No clusters detected, providing default response')
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