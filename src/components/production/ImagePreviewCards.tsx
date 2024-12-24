import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ImagePreviewCardsProps {
  clientReference?: string | null;
  designPreview?: string | null;
}

export const ImagePreviewCards = ({ clientReference, designPreview }: ImagePreviewCardsProps) => {
  if (!clientReference && !designPreview) return null;

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {clientReference && (
        <Card>
          <CardHeader>
            <CardTitle>Client Reference</CardTitle>
          </CardHeader>
          <CardContent>
            <img
              src={clientReference}
              alt="Client Reference"
              className="max-h-64 w-full object-contain rounded-lg"
            />
          </CardContent>
        </Card>
      )}

      {designPreview && (
        <Card>
          <CardHeader>
            <CardTitle>Balloon Design</CardTitle>
          </CardHeader>
          <CardContent>
            <img
              src={designPreview}
              alt="Design Preview"
              className="max-h-64 w-full object-contain rounded-lg"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};