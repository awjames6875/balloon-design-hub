import { DimensionsInput } from "../DimensionsInput"
import { StyleSelect } from "../StyleSelect"
import { ColorManager } from "../ColorManager"
import { useBalloonStyles } from "@/hooks/use-balloon-styles"

interface DesignDetailsFormProps {
  length: string
  style: string
  designImage: string | null
  onLengthChange: (value: string) => void
  onStyleChange: (value: string) => void
  onColorsSelected: (colors: string[]) => void
  isCalculating: boolean
}

export const DesignDetailsForm = ({
  length,
  style,
  designImage,
  onLengthChange,
  onStyleChange,
  onColorsSelected,
  isCalculating,
}: DesignDetailsFormProps) => {
  const { data: balloonStyles, isLoading: isLoadingStyles } = useBalloonStyles()

  const handleColorsSelected = (colors: string[]) => {
    console.log("Colors selected in DesignDetailsForm:", colors)
    onColorsSelected(colors)
  }

  return (
    <div className="space-y-4">
      <DimensionsInput
        length={length}
        onLengthChange={onLengthChange}
        disabled={isCalculating}
      />

      <StyleSelect
        value={style}
        onValueChange={onStyleChange}
        styles={balloonStyles}
        isLoading={isLoadingStyles}
        disabled={isCalculating}
      />

      <ColorManager
        designImage={designImage}
        onColorsSelected={handleColorsSelected}
        disabled={isCalculating}
      />
    </div>
  )
}