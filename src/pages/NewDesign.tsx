import { useState, useRef } from "react"
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
import { ChevronDown, Upload } from "lucide-react"
import { toast } from "sonner"

const NewDesign = () => {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [width, setWidth] = useState("")
  const [height, setHeight] = useState("")
  const [style, setStyle] = useState("")
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const balloonStyles = ["Straight", "Curved", "Cluster"]
  const balloonColors = ["Red", "Blue", "White", "Gold", "Pink", "Purple", "Green"]

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Create URL for preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
        
        // Simulate automatic dimension detection
        // In a real app, you'd use image processing here
        const img = new Image()
        img.onload = () => {
          const estimatedWidth = Math.ceil(img.width / 100)
          const estimatedHeight = Math.ceil(img.height / 100)
          setWidth(estimatedWidth.toString())
          setHeight(estimatedHeight.toString())
          
          // Simulate color detection
          // In a real app, you'd use color analysis
          const defaultColors = ["Red", "White"]
          setSelectedColors(defaultColors)
          setStyle("Cluster")
          
          toast.success("Design analyzed successfully!")
        }
        img.src = reader.result as string
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGenerateForm = () => {
    navigate("/production-forms", {
      state: {
        width,
        height,
        style,
        colors: selectedColors,
        imagePreview,
      },
    })
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-xl">
      <h1 className="text-2xl font-bold text-center mb-8">
        Create a New Balloon Design
      </h1>

      <div className="space-y-6">
        {/* Image Upload Section */}
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
               onClick={() => fileInputRef.current?.click()}>
            {imagePreview ? (
              <img 
                src={imagePreview} 
                alt="Design Preview" 
                className="max-h-64 mx-auto rounded-lg"
              />
            ) : (
              <div className="space-y-2">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="text-sm text-gray-500">
                  Click to upload your design image
                </p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>
        </div>

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