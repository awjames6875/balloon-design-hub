import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ClientInfoFieldsProps {
  clientName: string
  projectName: string
  onClientNameChange: (value: string) => void
  onProjectNameChange: (value: string) => void
}

export const ClientInfoFields = ({
  clientName,
  projectName,
  onClientNameChange,
  onProjectNameChange,
}: ClientInfoFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="clientName">Client Name</Label>
        <Input
          id="clientName"
          value={clientName}
          onChange={(e) => onClientNameChange(e.target.value)}
          placeholder="Enter client name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="projectName">Project Name</Label>
        <Input
          id="projectName"
          value={projectName}
          onChange={(e) => onProjectNameChange(e.target.value)}
          placeholder="Enter project name"
        />
      </div>
    </>
  )
}