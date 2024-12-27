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
      className={`w-full font-semibold transition-all duration-300 ${
        isValid && !isCalculating
          ? "bg-accent hover:bg-accent-hover text-white"
          : "bg-primary hover:bg-primary-hover text-white opacity-50"
      }`}
      disabled={!isValid || isCalculating}
      variant="default"
    >
      {isCalculating ? "Processing..." : buttonText}
    </Button>
  )
}