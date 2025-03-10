
import { Alert, AlertDescription } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"

export const DemoAlert = () => {
  return (
    <Alert>
      <InfoIcon className="h-4 w-4" />
      <AlertDescription>
        This is a demo of the inventory check system. Create a design with color clusters to see real inventory requirements.
      </AlertDescription>
    </Alert>
  )
}
