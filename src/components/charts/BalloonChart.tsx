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
  colors?: {
    actual?: string
    effective?: string
  }
}

export function BalloonChart({ 
  data,
  colors = {
    actual: "hsl(220 80% 50%)",
    effective: "hsl(150 80% 50%)"
  }
}: BalloonChartProps) {
  return (
    <div className="w-full h-full rounded-lg bg-white p-6">
      <div className="h-[600px]">
        <ChartContainer
          config={{
            actual: {
              label: "Actual Stock",
              theme: { 
                light: colors.actual || "hsl(220 80% 50%)", 
                dark: colors.actual || "hsl(220 80% 50%)" 
              },
            },
            effective: {
              label: "Effective Stock",
              theme: { 
                light: colors.effective || "hsl(150 80% 50%)", 
                dark: colors.effective || "hsl(150 80% 50%)" 
              },
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
              fill={colors.actual || "var(--color-actual)"}
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="effective" 
              fill={colors.effective || "var(--color-effective)"}
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