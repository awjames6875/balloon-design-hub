import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

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

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a balloon design assistant that processes commands about balloon clusters.
            Current configuration: ${JSON.stringify(currentClusters)}
            
            Your task is to analyze commands and return a JSON object with the changes requested.
            
            For total cluster changes (e.g. "total should be 11", "change total to 15"):
            {
              "type": "total_clusters",
              "clusterCount": number,
              "originalValue": number,
              "newValue": number,
              "action": "update_total"
            }
            
            For specific color changes (e.g. "change red to 5", "make blue 3"):
            {
              "type": "cluster_count",
              "color": "color_name",
              "clusterCount": number,
              "originalValue": number,
              "newValue": number,
              "action": "update_clusters"
            }
            
            Return ONLY the JSON object, no other text.`
          },
          {
            role: 'user',
            content: command
          }
        ],
        temperature: 0.1,
        max_tokens: 150,
      }),
    })

    const data = await response.json()
    console.log('OpenAI response:', data)

    if (!data.choices || !data.choices[0]?.message?.content) {
      throw new Error('Invalid response from OpenAI')
    }

    let correction
    try {
      correction = JSON.parse(data.choices[0].message.content)
      console.log('Parsed correction:', correction)
      
      // Enhanced validation
      if (!correction.type || 
          (correction.type !== 'cluster_count' && correction.type !== 'total_clusters') ||
          !correction.action ||
          (correction.type === 'cluster_count' && !correction.color) ||
          typeof correction.clusterCount !== 'number') {
        throw new Error('Invalid correction format')
      }

      // Add originalValue if not present
      if (correction.type === 'cluster_count' && currentClusters) {
        const matchingCluster = currentClusters.find(c => 
          c.color.toLowerCase() === correction.color.toLowerCase()
        )
        correction.originalValue = matchingCluster ? 
          matchingCluster.baseClusters + matchingCluster.extraClusters : 
          0
      } else if (correction.type === 'total_clusters' && currentClusters) {
        correction.originalValue = currentClusters.reduce(
          (sum, c) => sum + c.baseClusters + c.extraClusters, 
          0
        )
      }

    } catch (e) {
      console.error('Failed to parse OpenAI response:', e)
      return new Response(JSON.stringify({
        type: 'error',
        message: 'Could not understand command. Try "change total clusters to 11" or "set red clusters to 5"'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify(correction), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ 
      type: 'error',
      message: error.message || "Failed to process command"
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})