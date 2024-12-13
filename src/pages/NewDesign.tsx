import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"

const NewDesign = () => {
  const navigate = useNavigate()
  const [width, setWidth] = useState("")
  const [height, setHeight] = useState("")
  const [style, setStyle] = useState("")
  const [selectedColors, setSelectedColors] = useState<string[]>([])

  const balloonStyles = ["Straight", "Curved", "Cluster"]
  const balloonColors = ["Red", "Blue", "White", "Gold"]

  const handleGenerateForm = () => {
    navigate("/production-forms", {
      state: {
        width,
        height,
        style,
        colors: selectedColors,
      },
    })
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-xl">
      <h1 className="text-2xl font-bold text-center mb-8">
        Create a New Balloon Design
      </h1>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="width">Width (ft)</Label>
          <Input
            id="width"
            type="number"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            placeholder="Enter width"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="height">Height (ft)</Label>
          <Input
            id="height"
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="Enter height"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="style">Balloon Style</Label>
          <Select value={style} onValueChange={setStyle}>
            <SelectTrigger id="style">
              <SelectValue placeholder="Select style" />
            </SelectTrigger>
            <SelectContent>
              {balloonStyles.map((style) => (
                <SelectItem key={style} value={style}>
                  {style}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Balloon Colors</Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between"
                role="combobox"
              >
                {selectedColors.length === 0
                  ? "Select colors"
                  : `${selectedColors.length} selected`}
                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full">
              {balloonColors.map((color) => (
                <DropdownMenuCheckboxItem
                  key={color}
                  checked={selectedColors.includes(color)}
                  onCheckedChange={(checked) => {
                    setSelectedColors(
                      checked
                        ? [...selectedColors, color]
                        : selectedColors.filter((c) => c !== color)
                    )
                  }}
                >
                  {color}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Button
          className="w-full"
          onClick={handleGenerateForm}
          disabled={!width || !height || !style || selectedColors.length === 0}
        >
          Generate Production Form
        </Button>
      </div>
    </div>
  )
}

export default NewDesign