import { CompletedProjects } from "@/components/production/CompletedProjects"
import { BackToHome } from "@/components/BackToHome"

const CompletedProjectsPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <BackToHome />
      <CompletedProjects />
    </div>
  )
}

export default CompletedProjectsPage