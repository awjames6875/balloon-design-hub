import { Button } from "@/components/ui/button"
import { RefreshCw, FileText } from "lucide-react"

interface InventoryActionsProps {
  onRefresh: () => void
  onGenerate: () => void
  canProceed: boolean
  isLoading: boolean
  isGenerating: boolean
}

export const InventoryActions = ({
  onRefresh,
  onGenerate,
  canProceed,
  isLoading,
  isGenerating
}: InventoryActionsProps) => {
  return (
    <div className="flex gap-4">
      <Button 
        onClick={onRefresh} 
        variant="outline"
        disabled={isLoading || isGenerating}
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Refresh Inventory
      </Button>
      
      {canProceed && (
        <Button
          onClick={onGenerate}
          disabled={isLoading || isGenerating}
          className="flex-1"
        >
          <FileText className="w-4 h-4 mr-2" />
          Generate Production Form
        </Button>
      )}
    </div>
  )
}