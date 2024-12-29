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
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this balloon design image and extract: 1) balloon quantities by size (11-inch and 16-inch), 2) main colors used (max 4). Return ONLY a JSON object with no markdown formatting, with keys: sizes (array of {size, quantity}), colors (array of hex colors). Do not include any explanations or markdown."
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
      // Clean the content by removing any markdown code block syntax
      const cleanedContent = content.replace(/```json\n|\n```|```/g, '').trim()
      console.log('Cleaned content:', cleanedContent)

      // Parse the JSON response from the AI
      const aiResponse = JSON.parse(cleanedContent)
      console.log('Parsed AI response:', aiResponse)

      // Calculate clusters based on balloon quantities
      // Each cluster typically uses 11 11-inch balloons and 2 16-inch balloons
      const balloons11in = aiResponse.sizes.find(s => s.size === "11in")?.quantity || 0
      const balloons16in = aiResponse.sizes.find(s => s.size === "16in")?.quantity || 0

      // Calculate clusters based on the limiting factor
      const clusters11in = Math.floor(balloons11in / 11) // 11 11-inch balloons per cluster
      const clusters16in = Math.floor(balloons16in / 2)  // 2 16-inch balloons per cluster
      const totalClusters = Math.min(clusters11in, clusters16in)

      const analysisData = {
        clusters: totalClusters,
        colors: aiResponse.colors,
        sizes: aiResponse.sizes
      }

      // Validate the required fields
      if (!Array.isArray(analysisData.colors) || !Array.isArray(analysisData.sizes)) {
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