import { Button } from "@/components/ui/button"

interface FormSubmitButtonProps {
  isValid: boolean
  isCalculating: boolean
  buttonText: string
}

export const FormSubmitButton = ({
  isValid,
  isCalculating,
  buttonText,
}: FormSubmitButtonProps) => {
  return (
    <Button 
      type="submit" 
      className="w-full bg-primary hover:bg-primary-hover text-white font-semibold"
      disabled={!isValid || isCalculating}
      variant="default"
    >
      {isCalculating ? "Processing..." : buttonText}
    </Button>
  )
}