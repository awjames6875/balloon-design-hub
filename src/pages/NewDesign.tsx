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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChevronDown, Upload, Image as ImageIcon } from "lucide-react"
import { toast } from "sonner"
import { Textarea } from "@/components/ui/textarea"

const NewDesign = () => {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [width, setWidth] = useState("")
  const [height, setHeight] = useState("")
  const [style, setStyle] = useState("")
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [clientImage, setClientImage] = useState<string | null>(null)
  const [designImage, setDesignImage] = useState<string | null>(null)
  const [notes, setNotes] = useState("")

  const balloonStyles = ["Straight", "Curved", "Cluster", "Organic", "Geometric"]
  const balloonColors = [
    "Red",
    "Blue",
    "White",
    "Gold",
    "Pink",
    "Purple",
    "Green",
    "Silver",
    "Rose Gold",
  ]

  const handleClientImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setClientImage(reader.result as string)
        toast.success("Client reference image uploaded!")
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDesignImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setDesignImage(reader.result as string)
        
        // Simulate automatic dimension detection
        const img = new Image()
        img.onload = () => {
          const estimatedWidth = Math.ceil(img.width / 100)
          const estimatedHeight = Math.ceil(img.height / 100)
          setWidth(estimatedWidth.toString())
          setHeight(estimatedHeight.toString())
          setStyle("Organic")
          setSelectedColors(["White", "Gold"])
          toast.success("Design uploaded and measurements calculated!")
        }
        img.src = reader.result as string
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGenerateForm = () => {
    if (!designImage) {
      toast.error("Please upload your balloon design")
      return
    }

    navigate("/production-forms", {
      state: {
        width,
        height,
        style,
        colors: selectedColors,
        imagePreview: designImage,
        clientReference: clientImage,
        notes,
      },
    })
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold text-center mb-8">
        Create New Balloon Design
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Client Reference Image */}
        <Card>
          <CardHeader>
            <CardTitle>Client Reference</CardTitle>
            <CardDescription>Upload the client's inspiration image</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {clientImage ? (
                <img
                  src={clientImage}
                  alt="Client Reference"
                  className="max-h-64 mx-auto rounded-lg"
                />
              ) : (
                <div className="space-y-2">
                  <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="text-sm text-gray-500">
                    Click to upload client reference
                  </p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleClientImageUpload}
              />
            </div>
          </CardContent>
        </Card>

        {/* Balloon Design Upload */}
        <Card>
          <CardHeader>
            <CardTitle>Balloon Design</CardTitle>
            <CardDescription>Upload your balloon arrangement design</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
              onClick={() => {
                const input = document.createElement('input')
                input.type = 'file'
                input.accept = 'image/*'
                input.onchange = (e) => handleDesignImageUpload(e as any)
                input.click()
              }}
            >
              {designImage ? (
                <img
                  src={designImage}
                  alt="Balloon Design"
                  className="max-h-64 mx-auto rounded-lg"
                />
              ) : (
                <div className="space-y-2">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="text-sm text-gray-500">
                    Click to upload balloon design
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Design Specifications */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Design Specifications</CardTitle>
            <CardDescription>Enter the design details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any special instructions or notes for the production team..."
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 flex justify-center">
        <Button
          className="w-full max-w-md"
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