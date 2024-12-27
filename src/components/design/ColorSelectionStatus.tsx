interface ColorSelectionStatusProps {
  selectedCount: number
  requiredColors: number
}

export const ColorSelectionStatus = ({ 
  selectedCount, 
  requiredColors 
}: ColorSelectionStatusProps) => {
  return (
    <p className="text-sm text-muted-foreground mt-2">
      Selected colors: {selectedCount} / {requiredColors}
      {selectedCount < requiredColors && (
        <span className="text-red-500 ml-2">
          Please select {requiredColors - selectedCount} more color
          {requiredColors - selectedCount !== 1 ? 's' : ''}
        </span>
      )}
    </p>
  )
}