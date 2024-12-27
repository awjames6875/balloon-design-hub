import { toast } from "sonner"

interface ValidationParams {
  clientName: string
  projectName: string
  length: string
  style: string
  selectedColors: string[]
  calculations: any
}

export const validateDesignForm = ({
  clientName,
  projectName,
  length,
  style,
  selectedColors,
  calculations,
}: ValidationParams): boolean => {
  if (!clientName || !projectName) {
    toast.error("Please enter both client name and project name")
    return false
  }

  if (!length) {
    toast.error("Please enter the length")
    return false
  }

  if (!style) {
    toast.error("Please select a balloon style")
    return false
  }

  if (selectedColors.length !== 4) {
    toast.error("Please select exactly 4 colors")
    return false
  }

  if (!calculations) {
    toast.error("Please wait for calculations to complete")
    return false
  }

  return true
}