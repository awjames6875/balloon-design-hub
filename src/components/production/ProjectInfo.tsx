interface ProjectInfoProps {
  clientName: string;
  projectName: string;
  dimensionsFt: number;
}

export const ProjectInfo = ({ clientName, projectName, dimensionsFt }: ProjectInfoProps) => {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div>
        <h4 className="font-semibold mb-1">Client Name</h4>
        <p className="text-muted-foreground">{clientName}</p>
      </div>
      <div>
        <h4 className="font-semibold mb-1">Project Name</h4>
        <p className="text-muted-foreground">{projectName}</p>
      </div>
      <div>
        <h4 className="font-semibold mb-1">Length</h4>
        <p className="text-muted-foreground">{dimensionsFt} ft</p>
      </div>
    </div>
  );
};