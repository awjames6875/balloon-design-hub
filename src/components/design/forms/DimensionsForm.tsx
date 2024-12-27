import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DimensionsInput } from "../DimensionsInput"
import { StyleSelect } from "../StyleSelect"
import { useBalloonStyles } from "@/hooks/use-balloon-styles"

interface DimensionsFormProps {
  length: string
  style: string
  onLengthChange: (value: string) => void
  onStyleChange: (value: string) => void
  disabled?: boolean
}

export const DimensionsForm = ({
  length,
  style,
  onLengthChange,
  onStyleChange,
  disabled = false,
}: DimensionsFormProps) => {
  const { data: balloonStyles, isLoading: isLoadingStyles } = useBalloonStyles()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dimensions & Style</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <DimensionsInput
          length={length}
          onLengthChange={onLengthChange}
          disabled={disabled}
        />
        <StyleSelect
          value={style}
          onValueChange={onStyleChange}
          styles={balloonStyles}
          isLoading={isLoadingStyles}
          disabled={disabled}
        />
      </CardContent>
    </Card>
  )
}