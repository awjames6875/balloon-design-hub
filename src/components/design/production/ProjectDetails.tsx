interface ProjectDetailsProps {
  clientName: string;
  projectName: string;
  dimensions: string;
  style: string;
}

export const ProjectDetails = ({
  clientName,
  projectName,
  dimensions,
  style,
}: ProjectDetailsProps) => {
  return (
    <div className="space-y-2">
      <p><span className="font-semibold">Client:</span> {clientName}</p>
      <p><span className="font-semibold">Project:</span> {projectName}</p>
      <p><span className="font-semibold">Dimensions:</span> {dimensions} ft</p>
      <p><span className="font-semibold">Style:</span> {style}</p>
    </div>
  );
};