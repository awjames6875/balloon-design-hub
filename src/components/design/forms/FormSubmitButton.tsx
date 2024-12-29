import { Button } from "@/components/ui/button"

interface FormSubmitButtonProps {
  isCalculating: boolean
  isValid: boolean
  buttonText: string
}

export const FormSubmitButton = ({
  isCalculating,
  isValid,
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