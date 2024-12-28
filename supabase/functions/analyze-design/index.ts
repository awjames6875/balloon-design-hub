import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import OpenAI from "https://esm.sh/openai@4.28.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
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
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this balloon design image and extract: 1) number of balloon clusters, 2) main colors used (max 4), 3) balloon sizes used (11-inch or 16-inch). Format as JSON with keys: clusters (number), colors (array of hex colors), sizes (array of {size, quantity})."
            },
            {
              type: "image_url",
              image_url: {
                url: imageUrl
              }
            },
          ],
        },
      ],
      max_tokens: 1000,
    })

    const content = response.choices[0].message.content
    console.log('Raw OpenAI response:', content)

    try {
      // Parse the JSON response from the AI
      const analysisData = JSON.parse(content)
      console.log('Parsed analysis data:', analysisData)

      // Validate the required fields
      if (!analysisData.clusters || !Array.isArray(analysisData.colors) || !Array.isArray(analysisData.sizes)) {
        throw new Error('Invalid response format from AI')
      }

      // Save analysis to database
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      )

      const { error: dbError } = await supabase
        .from('design_analysis')
        .insert({
          clusters: analysisData.clusters,
          colors: analysisData.colors,
          sizes: analysisData.sizes
        })

      if (dbError) {
        console.error('Error saving analysis:', dbError)
        throw dbError
      }

      return new Response(
        JSON.stringify(analysisData),
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