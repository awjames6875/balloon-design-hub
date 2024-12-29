import { ColorManager } from "../ColorManager"
import { Card } from "@/components/ui/card"

interface ColorSelectionFormProps {
  designImage: string | null | undefined
  onColorsSelected: (colors: string[]) => void
  disabled?: boolean
}

export const ColorSelectionForm = ({
  designImage,
  onColorsSelected,
  disabled = false,
}: ColorSelectionFormProps) => {
  return (
    <Card className="mt-4">
      <ColorManager
        designImage={designImage}
        onColorsSelected={onColorsSelected}
        disabled={disabled}
      />
    </Card>
  )
}