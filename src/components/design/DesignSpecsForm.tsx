import { useState, useEffect } from "react"
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
import { toast } from "sonner"
import { supabase } from "@/integrations/supabase/client"
import { ProjectSearch } from "./ProjectSearch"
import { DimensionsInput } from "./DimensionsInput"
import { ShapeSelect } from "./ShapeSelect"
import { useBalloonStyles } from "@/hooks/use-balloon-styles"

const balloonColors = ["Orange", "Wild Berry", "Golden Rod", "Teal"]

export interface DesignSpecsFormData {
  clientName: string
  projectName: string
  width: string
  height: string
  colors: string[]
  style: string
  shape: string
}

interface DesignSpecsFormProps {
  onSubmit: (data: DesignSpecsFormData) => void
}

interface ClientProject {
  client_name: string
  project_name: string
}

export const DesignSpecsForm = ({ onSubmit }: DesignSpecsFormProps) => {
  const [clientName, setClientName] = useState("")
  const [projectName, setProjectName] = useState("")
  const [width, setWidth] = useState("")
  const [height, setHeight] = useState("")
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [style, setStyle] = useState("")
  const [shape, setShape] = useState("Straight")
  const [existingProjects, setExistingProjects] = useState<ClientProject[]>([])
  
  const { data: balloonStyles, isLoading: isLoadingStyles } = useBalloonStyles()

  useEffect(() => {
    fetchExistingProjects()
  }, [])

  const fetchExistingProjects = async () => {
    try {
      const { data, error } = await supabase
        .from("client_projects")
        .select("client_name, project_name")
        .order("created_at", { ascending: false })

      if (error) throw error
      setExistingProjects(data || [])
    } catch (error) {
      console.error("Error fetching projects:", error)
      toast.error("Failed to load existing projects")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
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

    try {
      const { error } = await supabase
        .from("client_projects")
        .insert([{ client_name: clientName, project_name: projectName }])

      if (error) throw error

      toast.success("Project saved successfully!")
      
      onSubmit({
        clientName,
        projectName,
        width,
        height,
        colors: selectedColors,
        style,
        shape,
      })
    } catch (error) {
      console.error("Error saving project:", error)
      toast.error("Failed to save project")
    }
  }

  const handleProjectSelect = (project: ClientProject) => {
    setClientName(project.client_name)
    setProjectName(project.project_name)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <ProjectSearch
        existingProjects={existingProjects}
        onProjectSelect={handleProjectSelect}
      />

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

      <DimensionsInput
        width={width}
        height={height}
        onWidthChange={setWidth}
        onHeightChange={setHeight}
      />

      <div className="space-y-2">
        <Label>Balloon Style</Label>
        <Select value={style} onValueChange={setStyle}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select balloon style" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800 border shadow-lg">
            {isLoadingStyles ? (
              <SelectItem value="loading">Loading styles...</SelectItem>
            ) : (
              balloonStyles?.map((item) => (
                <SelectItem 
                  key={item.style_name} 
                  value={item.style_name}
                  className="hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {item.style_name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      <ShapeSelect value={shape} onValueChange={setShape} />

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
          <DropdownMenuContent className="w-[200px] bg-white dark:bg-gray-800 border shadow-lg">
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
                className="hover:bg-gray-100 dark:hover:bg-gray-700"
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