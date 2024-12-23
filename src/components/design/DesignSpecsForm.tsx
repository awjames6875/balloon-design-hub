import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { supabase } from "@/integrations/supabase/client"
import { ProjectSearch } from "./ProjectSearch"
import { DimensionsInput } from "./DimensionsInput"
import { ShapeSelect } from "./ShapeSelect"
import { ColorSelect } from "./ColorSelect"
import { StyleSelect } from "./StyleSelect"
import { ClientInfoFields } from "./ClientInfoFields"
import { useBalloonStyles } from "@/hooks/use-balloon-styles"

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

      <ClientInfoFields
        clientName={clientName}
        projectName={projectName}
        onClientNameChange={setClientName}
        onProjectNameChange={setProjectName}
      />

      <DimensionsInput
        width={width}
        height={height}
        onWidthChange={setWidth}
        onHeightChange={setHeight}
      />

      <StyleSelect
        value={style}
        onValueChange={setStyle}
        styles={balloonStyles}
        isLoading={isLoadingStyles}
      />

      <ShapeSelect value={shape} onValueChange={setShape} />

      <ColorSelect
        selectedColors={selectedColors}
        onColorsChange={setSelectedColors}
      />

      <Button type="submit" className="w-full">
        Generate Production Form
      </Button>
    </form>
  )
}