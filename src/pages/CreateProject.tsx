import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { supabase } from "@/integrations/supabase/client"
import { BackToHome } from "@/components/BackToHome"

export const CreateProject = () => {
  const navigate = useNavigate()
  const [clientName, setClientName] = useState("")
  const [projectName, setProjectName] = useState("")
  const [dimensions, setDimensions] = useState("")
  const [style, setStyle] = useState("Straight")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!clientName || !projectName || !dimensions) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      // First check if project exists
      const { data: existingProject } = await supabase
        .from("client_projects")
        .select("id")
        .eq("client_name", clientName)
        .eq("project_name", projectName)
        .maybeSingle()

      // Only insert if project doesn't exist
      if (!existingProject) {
        const { error: projectError } = await supabase
          .from("client_projects")
          .insert([{
            client_name: clientName,
            project_name: projectName,
          }])

        if (projectError) {
          console.error("Error saving project:", projectError)
          toast.error("Failed to save project")
          return
        }
      }

      // Store the project details in localStorage for the next step
      localStorage.setItem("currentProject", JSON.stringify({
        clientName,
        projectName,
        dimensions: parseInt(dimensions),
        style
      }))

      toast.success("Project created successfully!")
      navigate("/cluster-details")
    } catch (error) {
      console.error("Error creating project:", error)
      toast.error("Failed to create project")
    }
  }

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <BackToHome />
      
      <Card>
        <CardHeader>
          <CardTitle>Create New Project</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="clientName">Client Name</Label>
              <Input
                id="clientName"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Enter client's name"
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

            <div className="space-y-2">
              <Label htmlFor="dimensions">Dimensions (ft)</Label>
              <Input
                id="dimensions"
                type="number"
                min="1"
                value={dimensions}
                onChange={(e) => setDimensions(e.target.value)}
                placeholder="Enter garland dimensions (e.g., 10 ft)"
              />
            </div>

            <div className="space-y-2">
              <Label>Style</Label>
              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger>
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Straight">Straight</SelectItem>
                  <SelectItem value="Curved">Curved</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full">
              Next
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default CreateProject