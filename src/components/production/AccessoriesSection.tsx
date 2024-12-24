interface AccessoriesSectionProps {
  accents: Record<string, any>;
}

export const AccessoriesSection = ({ accents }: AccessoriesSectionProps) => {
  if (!accents || Object.keys(accents).length === 0) return null;

  return (
    <div>
      <h4 className="font-semibold mb-2">Accessories</h4>
      <div className="grid gap-2">
        {Object.entries(accents).map(([key, value]) => (
          <div key={key} className="flex justify-between items-center py-1 px-2 bg-gray-50 rounded">
            <span className="capitalize">{key}</span>
            <span>{typeof value === 'object' ? JSON.stringify(value) : String(value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};