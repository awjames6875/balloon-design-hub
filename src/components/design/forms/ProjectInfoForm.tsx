import { ProjectSearch } from "../ProjectSearch"
import { ClientInfoFields } from "../ClientInfoFields"

interface ProjectInfoFormProps {
  clientName: string
  projectName: string
  onClientNameChange: (value: string) => void
  onProjectNameChange: (value: string) => void
  onProjectSelect: (project: { client_name: string; project_name: string }) => void
}

export const ProjectInfoForm = ({
  clientName,
  projectName,
  onClientNameChange,
  onProjectNameChange,
  onProjectSelect,
}: ProjectInfoFormProps) => {
  return (
    <div className="space-y-4">
      <ProjectSearch onProjectSelect={onProjectSelect} />
      <ClientInfoFields
        clientName={clientName}
        projectName={projectName}
        onClientNameChange={onClientNameChange}
        onProjectNameChange={onProjectNameChange}
      />
    </div>
  )
}