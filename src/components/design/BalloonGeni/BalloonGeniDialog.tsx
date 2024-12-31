import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { CorrectionProps } from "./types"

interface BalloonGeniDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  correction: CorrectionProps | null;
  onConfirm: () => void;
}

export const BalloonGeniDialog: React.FC<BalloonGeniDialogProps> = ({
  isOpen,
  onOpenChange,
  correction,
  onConfirm
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Change</AlertDialogTitle>
          <AlertDialogDescription>
            {correction && `Are you sure you want to ${correction.action} for ${correction.color}?
            New value: ${correction.newValue}`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onOpenChange(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}