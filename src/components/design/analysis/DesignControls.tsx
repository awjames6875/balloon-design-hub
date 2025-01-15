import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { toast } from "sonner"

interface DesignControlsProps {
  hasDesign: boolean
  onRefresh: () => void
}

export const DesignControls = ({ hasDesign, onRefresh }: DesignControlsProps) => {
  const handleRefresh = () => {
    onRefresh()
    toast.success("Analysis data cleared. You can now upload a new design.")
  }

  if (!hasDesign) return null

  return (
    <Button 
      variant="outline" 
      size="icon"
      onClick={handleRefresh}
      className="h-8 w-8"
      title="Start Over"
    >
      <RefreshCw className="h-4 w-4" />
    </Button>
  )
}