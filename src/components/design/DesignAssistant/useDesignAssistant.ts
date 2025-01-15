import { useState } from "react"
import { toast } from "sonner"
import { supabase } from "@/integrations/supabase/client"
import type { CorrectionProps } from "../BalloonGeni/types"
import type { ColorCluster } from "../ColorClusterManager"

interface UseDesignAssistantProps {
  onUpdate: (correction: CorrectionProps) => Promise<void>
  colorClusters?: ColorCluster[]
}

export const useDesignAssistant = ({ onUpdate, colorClusters }: UseDesignAssistantProps) => {
  const [isConfirming, setIsConfirming] = useState<boolean>(false)
  const [currentCorrection, setCurrentCorrection] = useState<CorrectionProps | null>(null)
  const [history, setHistory] = useState<CorrectionProps[]>([])
  const [inputValue, setInputValue] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)

  const handleCommand = async (command: string) => {
    console.log("Processing command:", command)
    setIsProcessing(true)
    
    try {
      const { data, error } = await supabase.functions.invoke('process-design-command', {
        body: { 
          command,
          currentClusters: colorClusters
        }
      })

      if (error) {
        console.error("Error processing command:", error)
        toast.error("Failed to process command")
        return
      }

      console.log("Generated correction:", data)
      
      if (data) {
        if (data.type === 'error') {
          toast.error(data.message || "I couldn't understand that command. Try something like 'change red clusters to 5' or 'set blue to 3 clusters'")
          return
        }
        setCurrentCorrection(data)
        setIsConfirming(true)
      } else {
        toast.error("I couldn't understand that command. Try something like 'change red clusters to 5' or 'set blue to 3 clusters'")
      }
    } catch (error) {
      console.error("Error processing command:", error)
      toast.error("Failed to process command")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleConfirm = async () => {
    if (!currentCorrection) return

    try {
      await onUpdate(currentCorrection)
      
      // Add to history
      setHistory(prev => [...prev, currentCorrection])
      
      // Reset state
      setIsConfirming(false)
      setCurrentCorrection(null)
      setInputValue('')
      
      toast.success(`Updated ${currentCorrection.color} clusters successfully`)
    } catch (error) {
      console.error('Error updating:', error)
      toast.error("Failed to apply correction")
    }
  }

  return {
    isConfirming,
    setIsConfirming,
    currentCorrection,
    history,
    inputValue,
    setInputValue,
    isProcessing,
    handleCommand,
    handleConfirm
  }
}