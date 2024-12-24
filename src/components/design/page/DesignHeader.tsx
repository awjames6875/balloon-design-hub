import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const DesignHeader = () => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Create New Design</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Fill in the design specifications to generate a production form.
        </p>
      </CardContent>
    </Card>
  )
}