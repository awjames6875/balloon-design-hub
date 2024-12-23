import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis } from "recharts"

interface BalloonChartProps {
  data: Array<{
    name: string
    actual: number
    effective: number
  }>
}

export function BalloonChart({ data }: BalloonChartProps) {
  return (
    <div className="h-[300px]">
      <ChartContainer
        config={{
          actual: {
            label: "Actual Stock",
            theme: { light: "hsl(220 80% 50%)", dark: "hsl(220 80% 50%)" },
          },
          effective: {
            label: "Effective Stock",
            theme: { light: "hsl(150 80% 50%)", dark: "hsl(150 80% 50%)" },
          },
        }}
      >
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Bar dataKey="actual" fill="var(--color-actual)" />
          <Bar dataKey="effective" fill="var(--color-effective)" />
          <ChartTooltip>
            <ChartTooltipContent />
          </ChartTooltip>
          <ChartLegend>
            <ChartLegendContent />
          </ChartLegend>
        </BarChart>
      </ChartContainer>
    </div>
  )
}