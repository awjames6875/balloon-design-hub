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
      className="w-full"
      disabled={!isValid || isCalculating}
    >
      {buttonText}
    </Button>
  )
}