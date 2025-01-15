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

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Changes</DialogTitle>
          <DialogDescription>
            Are you sure you want to update {correction.color} to {correction.newValue} clusters?
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