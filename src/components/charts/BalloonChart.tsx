import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"

interface BalloonChartProps {
  data: Array<{
    name: string
    actual: number
    effective: number
  }>
}

export function BalloonChart({ data }: BalloonChartProps) {
  return (
    <div className="w-full space-y-6 rounded-lg bg-white p-6">
      <div className="h-[400px]">
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
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              angle={-45}
              textAnchor="end"
              height={70}
              interval={0}
            />
            <YAxis />
            <Bar 
              dataKey="actual" 
              fill="var(--color-actual)"
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="effective" 
              fill="var(--color-effective)"
              radius={[4, 4, 0, 0]}
            />
            <ChartTooltip 
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <ChartTooltipContent
                      active={active}
                      payload={payload}
                      label={label}
                    />
                  )
                }
                return null
              }}
            />
            <ChartLegend>
              <ChartLegendContent />
            </ChartLegend>
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  )
}