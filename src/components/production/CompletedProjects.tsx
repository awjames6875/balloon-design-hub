import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Tables } from "@/integrations/supabase/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { format } from "date-fns"

export const CompletedProjects = () => {
  const navigate = useNavigate()
  const { data: projects, isLoading } = useQuery({
    queryKey: ["completed-projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("production_details")
        .select("*")
        .order("creation_date", { ascending: false })

      if (error) throw error
      return data as Tables<"production_details">[]
    },
  })

  if (isLoading) {
    return <div>Loading projects...</div>
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Completed Projects</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects?.map((project) => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">{project.project_name}</CardTitle>
              <p className="text-sm text-muted-foreground">{project.client_name}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Dimensions:</span> {project.dimensions_ft} ft
                </p>
                <p>
                  <span className="font-medium">Total Clusters:</span> {project.total_clusters}
                </p>
                <p>
                  <span className="font-medium">Date:</span>{" "}
                  {project.creation_date
                    ? format(new Date(project.creation_date), "MMM d, yyyy")
                    : "N/A"}
                </p>
                <Button 
                  className="w-full mt-4"
                  onClick={() => navigate(`/production/${project.id}`)}
                >
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}