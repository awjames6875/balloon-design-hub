import { useState, useEffect } from "react"
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
import { supabase } from "@/integrations/supabase/client"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

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
  const [existingProjects, setExistingProjects] = useState<ClientProject[]>([])
  const [open, setOpen] = useState(false)

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
      })
    } catch (error) {
      console.error("Error saving project:", error)
      toast.error("Failed to save project")
    }
  }

  const handleProjectSelect = (project: ClientProject) => {
    setClientName(project.client_name)
    setProjectName(project.project_name)
    setOpen(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="projectSearch">Search Existing Projects</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
            >
              Search projects...
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search projects..." />
              <CommandEmpty>No projects found.</CommandEmpty>
              <CommandGroup>
                {existingProjects.map((project, index) => (
                  <CommandItem
                    key={index}
                    onSelect={() => handleProjectSelect(project)}
                  >
                    {project.client_name} - {project.project_name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

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
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select balloon style" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800 border shadow-lg">
            {balloonDensityData.map((item) => (
              <SelectItem 
                key={item.Style} 
                value={item.Style}
                className="hover:bg-gray-100 dark:hover:bg-gray-700"
              >
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