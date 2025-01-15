import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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

    // Call OpenAI API
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
            content: `You are a balloon design assistant that helps modify balloon cluster specifications.
            Your task is to analyze commands about balloon clusters and return structured data about the changes requested.
            Current clusters: ${JSON.stringify(currentClusters)}
            
            Example commands and their interpretations:
            - "change red clusters to 5" -> { type: "cluster_count", color: "red", clusterCount: 5 }
            - "set blue to 3 clusters" -> { type: "cluster_count", color: "blue", clusterCount: 3 }
            - "make orange 4" -> { type: "cluster_count", color: "orange", clusterCount: 4 }
            - "total clusters should be 11" -> { type: "total_clusters", clusterCount: 11 }
            - "change total to 15 clusters" -> { type: "total_clusters", clusterCount: 15 }
            
            Return format must be:
            For color changes:
            {
              type: "cluster_count",
              color: string,
              clusterCount: number,
              originalValue: number | null,
              newValue: number,
              action: "update_clusters"
            }
            
            For total cluster changes:
            {
              type: "total_clusters",
              clusterCount: number,
              originalValue: number | null,
              newValue: number,
              action: "update_total"
            }`
          },
          {
            role: 'user',
            content: command
          }
        ],
        temperature: 0.1,
        max_tokens: 200,
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
      
      // Validate the correction format
      if (!correction.type || 
          (correction.type !== 'cluster_count' && correction.type !== 'total_clusters') ||
          !correction.action ||
          (correction.type === 'cluster_count' && !correction.color)) {
        throw new Error('Invalid correction format')
      }
    } catch (e) {
      console.error('Failed to parse OpenAI response:', e)
      correction = {
        type: 'error',
        message: 'Could not understand command. Try something like "change red clusters to 5" or "total clusters should be 11"'
      }
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