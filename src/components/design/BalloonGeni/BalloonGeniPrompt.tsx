import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandInput
} from "@/components/ui/command"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

interface CorrectionProps {
  type: 'cluster_count' | 'color_name' | 'balloon_count' | 'add_color' | 'remove_color'
  originalValue: any
  newValue: any
  color: string
  action: string
}

const analyzeGeniCommand = (command: string): CorrectionProps | null => {
  const patterns = [
    // Cluster count changes
    {
      regex: /change (\w+) clusters? (?:from \d+ )?to (\d+)/i,
      handler: (matches: string[]) => ({
        type: 'cluster_count',
        color: matches[1],
        originalValue: null,
        newValue: parseInt(matches[2]),
        action: 'update_clusters'
      })
    },
    // Color name changes
    {
      regex: /change (\w+) color to (\w+)/i,
      handler: (matches: string[]) => ({
        type: 'color_name',
        originalValue: matches[1],
        newValue: matches[2],
        color: matches[1],
        action: 'update_color'
      })
    },
    // Add new color
    {
      regex: /add (\w+) with (\d+) clusters?/i,
      handler: (matches: string[]) => ({
        type: 'add_color',
        color: matches[1],
        newValue: parseInt(matches[2]),
        originalValue: null,
        action: 'add_color'
      })
    }
  ]

  for (const pattern of patterns) {
    const matches = command.match(pattern.regex)
    if (matches) {
      return pattern.handler(matches)
    }
  }

  return null
}

const BalloonGeni = () => {
  const [isConfirming, setIsConfirming] = useState(false)
  const [currentCorrection, setCurrentCorrection] = useState<CorrectionProps | null>(null)
  const [history, setHistory] = useState<CorrectionProps[]>([])
  const [inputValue, setInputValue] = useState("")

  const handleCommand = (command: string) => {
    const correction = analyzeGeniCommand(command)
    if (correction) {
      setCurrentCorrection(correction)
      setIsConfirming(true)
    } else {
      toast.error("I couldn't understand that command", {
        description: "Try something like 'change Red clusters to 5' or 'add Blue with 3 clusters'"
      })
    }
    setInputValue("")
  }

  const handleConfirm = async () => {
    if (!currentCorrection) return

    try {
      // Update Supabase
      const { error } = await supabase
        .from('balloon_inventory')
        .update({ 
          [currentCorrection.type]: currentCorrection.newValue 
        })
        .eq('color', currentCorrection.color)

      if (error) {
        toast.error("Failed to update", {
          description: error.message
        })
        return
      }

      // Add to history
      setHistory([...history, currentCorrection])
      
      toast.success("Update successful", {
        description: `${currentCorrection.action} for ${currentCorrection.color}`
      })

      // Reset state
      setIsConfirming(false)
      setCurrentCorrection(null)

    } catch (error) {
      console.error('Error updating:', error)
      toast.error("An unexpected error occurred")
    }
  }

  const handleUndo = async () => {
    if (history.length === 0) return
    
    const lastCorrection = history[history.length - 1]
    try {
      const { error } = await supabase
        .from('balloon_inventory')
        .update({ 
          [lastCorrection.type]: lastCorrection.originalValue 
        })
        .eq('color', lastCorrection.color)

      if (error) {
        toast.error("Failed to undo", {
          description: error.message
        })
        return
      }

      toast.success("Change undone successfully")
      
      // Remove from history
      setHistory(history.slice(0, -1))
    } catch (error) {
      console.error('Error undoing:', error)
      toast.error("An unexpected error occurred while undoing the change")
    }
  }

  return (
    <div className="mt-4 p-4 border rounded-lg">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm font-medium">Balloon Geni</span>
        {history.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleUndo}
          >
            Undo
          </Button>
        )}
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

      {isConfirming && currentCorrection && (
        <AlertDialog open={isConfirming} onOpenChange={setIsConfirming}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Change</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to {currentCorrection.action} for {currentCorrection.color}?
                New value: {currentCorrection.newValue}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setIsConfirming(false)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirm}>
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  )
}

export default BalloonGeni