import { useState } from "react"
import { Command, CommandInput } from "@/components/ui/command"
import { BalloonGeniDialog } from "./BalloonGeniDialog"
import { analyzeGeniCommand } from "./commandPatterns"
import type { BalloonGeniProps, CorrectionProps } from "./types"

const BalloonGeni: React.FC<BalloonGeniProps> = ({ onUpdate }) => {
  const [isConfirming, setIsConfirming] = useState<boolean>(false)
  const [currentCorrection, setCurrentCorrection] = useState<CorrectionProps | null>(null)
  const [history, setHistory] = useState<CorrectionProps[]>([])
  const [inputValue, setInputValue] = useState<string>('')

  const handleCommand = async (command: string) => {
    const correction = analyzeGeniCommand(command)
    if (correction) {
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
    }
  }

  return (
    <div className="mt-4 p-4 border rounded-lg">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm font-medium">Balloon Geni</span>
      </div>

      <Command className="rounded-lg border">
        <CommandInput 
          placeholder="Tell me what needs to be corrected..." 
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

export default BalloonGeni