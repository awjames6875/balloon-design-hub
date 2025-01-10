import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"
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
    const { command, currentClusters } = await req.json()
    console.log('Processing command:', command)
    console.log('Current clusters:', currentClusters)

    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY')
    })

    const systemPrompt = `You are a balloon design assistant that processes commands to modify balloon clusters.
Current clusters configuration: ${JSON.stringify(currentClusters)}

Your task is to:
1. Understand the user's command about modifying balloon clusters
2. Return a structured response that matches one of these patterns:
- Changing cluster count: { type: 'cluster_count', color: 'color_name', clusterCount: number }
- Adding color: { type: 'add_color', color: 'color_name', clusterCount: number }
- Removing color: { type: 'remove_color', color: 'color_name' }

Only return the JSON object, nothing else.`

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: command }
      ],
      temperature: 0.1,
    })

    const result = response.choices[0].message.content
    console.log('LLM response:', result)

    try {
      const parsedResult = JSON.parse(result)
      return new Response(
        JSON.stringify(parsedResult),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } catch (parseError) {
      console.error('Failed to parse LLM response:', parseError)
      throw new Error('Invalid response format from LLM')
    }

  } catch (error) {
    console.error('Error processing command:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})