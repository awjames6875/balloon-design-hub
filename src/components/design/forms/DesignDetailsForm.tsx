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
}

export const DesignDetailsForm = ({
  length,
  style,
  designImage,
  onLengthChange,
  onStyleChange,
  onColorsSelected,
}: DesignDetailsFormProps) => {
  const { data: balloonStyles, isLoading: isLoadingStyles } = useBalloonStyles()

  return (
    <div className="space-y-4">
      <DimensionsInput
        length={length}
        onLengthChange={onLengthChange}
      />

      <StyleSelect
        value={style}
        onValueChange={onStyleChange}
        styles={balloonStyles}
        isLoading={isLoadingStyles}
      />

      <ColorManager
        designImage={designImage}
        onColorsSelected={onColorsSelected}
      />
    </div>
  )
}