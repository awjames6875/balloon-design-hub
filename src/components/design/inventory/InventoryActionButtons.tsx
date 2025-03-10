
import { Button } from "@/components/ui/button"

interface InventoryActionButtonsProps {
  onRefresh: () => void
  onGenerateForm: () => void
  isLoading: boolean
  isGeneratingForm: boolean
  canProceed: boolean
}

export const InventoryActionButtons = ({
  onRefresh,
  onGenerateForm,
  isLoading,
  isGeneratingForm,
  canProceed
}: InventoryActionButtonsProps) => {
  return (
    <div className="flex gap-4">
      <Button 
        onClick={onRefresh} 
        variant="outline"
        disabled={isLoading || isGeneratingForm}
      >
        Refresh Inventory
      </Button>
      {canProceed && (
        <Button
          onClick={onGenerateForm}
          disabled={isLoading || isGeneratingForm}
          className="flex-1"
        >
          Generate Production Form
        </Button>
      )}
    </div>
  )
}
