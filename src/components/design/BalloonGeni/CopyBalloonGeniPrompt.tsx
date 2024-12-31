import { useState } from "react"
import { Command, CommandInput } from "@/components/ui/command"
import { BalloonGeniDialog } from "./BalloonGeniDialog"
import { analyzeGeniCommand } from "./commandPatterns"
import type { BalloonGeniProps, CorrectionProps } from "./types"
import { toast } from "sonner"

const CopyBalloonGeniPrompt: React.FC<BalloonGeniProps> = ({ onUpdate, colorClusters }) => {
  const [isConfirming, setIsConfirming] = useState<boolean>(false)
  const [currentCorrection, setCurrentCorrection] = useState<CorrectionProps | null>(null)
  const [history, setHistory] = useState<CorrectionProps[]>([])
  const [inputValue, setInputValue] = useState<string>('')

  const handleCommand = async (command: string) => {
    console.log("Processing command:", command)
    const correction = analyzeGeniCommand(command)
    if (correction) {
      // Validate the correction against current colorClusters
      const isValidColor = colorClusters?.some(
        cluster => cluster.color.toLowerCase() === correction.color.toLowerCase()
      )

      if (!isValidColor) {
        toast.error(`Color ${correction.color} not found in current design`)
        return
      }

      console.log("Correction generated:", correction)
      setCurrentCorrection(correction)
      setIsConfirming(true)
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
    } catch (error) {
      console.error('Error updating:', error)
      toast.error("Failed to apply correction")
    }
  }

  return (
    <div className="mt-4 p-4 border rounded-lg">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm font-medium">Copy Balloon Geni</span>
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
      </Command>

      <BalloonGeniDialog
        isOpen={isConfirming}
        onOpenChange={setIsConfirming}
        correction={currentCorrection}
        onConfirm={handleConfirm}
      />
    </div>
  )
}

export default CopyBalloonGeniPrompt