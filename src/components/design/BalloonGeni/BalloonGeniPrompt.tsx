import { useState } from "react"
import { Command, CommandInput, CommandList, CommandEmpty } from "@/components/ui/command"
import { BalloonGeniDialog } from "./BalloonGeniDialog"
import type { BalloonGeniProps, CorrectionProps } from "./types"
import { toast } from "sonner"
import { supabase } from "@/integrations/supabase/client"

const BalloonGeni: React.FC<BalloonGeniProps> = ({ onUpdate, colorClusters }) => {
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

  return (
    <div className="mt-4 p-4 border rounded-lg">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm font-medium">Design Assistant</span>
        {isProcessing && (
          <span className="text-sm text-muted-foreground">Processing...</span>
        )}
      </div>

      <Command shouldFilter={false} className="rounded-lg border shadow-none">
        <CommandInput 
          placeholder="Tell me what needs to be corrected... (e.g., change red clusters to 5)" 
          value={inputValue}
          onValueChange={setInputValue}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && inputValue.trim()) {
              handleCommand(inputValue.trim())
            }
          }}
        />
        <CommandList>
          <CommandEmpty>Type a command and press Enter...</CommandEmpty>
        </CommandList>
      </Command>

      <BalloonGeniDialog
        isOpen={isConfirming}
        onOpenChange={setIsConfirming}
        correction={currentCorrection}
        onConfirm={handleConfirm}
      />

      {history.length > 0 && (
        <div className="mt-4">
          <p className="text-sm text-muted-foreground mb-2">Recent changes:</p>
          <ul className="text-sm space-y-1">
            {history.map((correction, index) => (
              <li key={index} className="text-muted-foreground">
                • Changed {correction.color} to {correction.newValue} clusters
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default BalloonGeni