import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ChevronDown } from "lucide-react"
import { toast } from "sonner"
import { balloonDensityData } from "@/lib/balloon-density"

const balloonColors = ["Orange", "Wild Berry", "Golden Rod", "Teal"]

export interface DesignSpecsFormData {
  clientName: string
  projectName: string
  width: string
  height: string
  colors: string[]
  style: string
}

interface DesignSpecsFormProps {
  onSubmit: (data: DesignSpecsFormData) => void
}

export const DesignSpecsForm = ({ onSubmit }: DesignSpecsFormProps) => {
  const [clientName, setClientName] = useState("")
  const [projectName, setProjectName] = useState("")
  const [width, setWidth] = useState("")
  const [height, setHeight] = useState("")
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [style, setStyle] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!clientName || !projectName) {
      toast.error("Please enter both client name and project name")
      return
    }

    if (!width || !height) {
      toast.error("Please enter both width and height")
      return
    }

    if (selectedColors.length === 0) {
      toast.error("Please select at least one color")
      return
    }

    if (!style) {
      toast.error("Please select a balloon style")
      return
    }

    onSubmit({
      clientName,
      projectName,
      width,
      height,
      colors: selectedColors,
      style,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="clientName">Client Name</Label>
        <Input
          id="clientName"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          placeholder="Enter client name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="projectName">Project Name</Label>
        <Input
          id="projectName"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Enter project name"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
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
      </div>

      <div className="space-y-2">
        <Label>Balloon Style</Label>
        <Select value={style} onValueChange={setStyle}>
          <SelectTrigger>
            <SelectValue placeholder="Select balloon style" />
          </SelectTrigger>
          <SelectContent>
            {balloonDensityData.map((item) => (
              <SelectItem key={item.Style} value={item.Style}>
                {item.Style}
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
          <DropdownMenuContent className="w-[200px]">
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

      <Button type="submit" className="w-full">
        Generate Production Form
      </Button>
    </form>
  )
}