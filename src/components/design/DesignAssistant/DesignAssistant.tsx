import { useState } from "react"
import { Command, CommandInput, CommandList, CommandEmpty } from "@/components/ui/command"
import { toast } from "sonner"
import { supabase } from "@/integrations/supabase/client"
import { DesignAssistantDialog } from "./DesignAssistantDialog"
import { useDesignAssistant } from "./useDesignAssistant"
import type { CorrectionProps } from "../BalloonGeni/types"
import type { ColorCluster } from "../ColorClusterManager"

interface DesignAssistantProps {
  onUpdate: (correction: CorrectionProps) => Promise<void>
  colorClusters?: ColorCluster[]
}

export const DesignAssistant = ({ onUpdate, colorClusters }: DesignAssistantProps) => {
  const {
    isConfirming,
    setIsConfirming,
    currentCorrection,
    history,
    inputValue,
    setInputValue,
    isProcessing,
    handleCommand,
    handleConfirm
  } = useDesignAssistant({ onUpdate, colorClusters })

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

      <DesignAssistantDialog
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