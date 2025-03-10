
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { CorrectionProps } from "../BalloonGeni/types"

interface DesignAssistantDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  correction: CorrectionProps | null
  onConfirm: () => void
}

export const DesignAssistantDialog = ({
  isOpen,
  onOpenChange,
  correction,
  onConfirm,
}: DesignAssistantDialogProps) => {
  if (!correction) return null

  const getDialogDescription = () => {
    if (correction.type === 'cluster_count') {
      return `Are you sure you want to update ${correction.color} from ${correction.originalValue} to ${correction.newValue} clusters?`
    } else if (correction.type === 'total_clusters') {
      return `Are you sure you want to update total clusters from ${correction.originalValue} to ${correction.newValue}?`
    }
    return 'Are you sure you want to make this change?'
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Changes</DialogTitle>
          <DialogDescription>
            {getDialogDescription()}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
