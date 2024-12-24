import { BalloonChart } from "@/components/charts/BalloonChart"
import { balloonDensityData } from "@/lib/balloon-density"
import type { BalloonInventory } from "./types"

interface StockAnalyticsSectionProps {
  inventory: BalloonInventory[]
}

export const StockAnalyticsSection = ({ inventory }: StockAnalyticsSectionProps) => {
  const getUsageData = () => {
    return inventory.map((item) => ({
      name: `${item.type} (${item.style})`,
      actual: item.inStock,
      effective: Math.floor(
        item.inStock *
          (balloonDensityData.find((d) => d.Style === item.style)?.Density || 1)
      ),
    }))
  }

  return (
    <section className="bg-white rounded-lg shadow-md mt-8">
      <h2 className="text-xl font-semibold p-6 pb-0">Stock Usage Analytics</h2>
      <p className="text-sm text-gray-600 px-6 pb-2">
        Compare actual stock levels with effective usage across different balloon types
      </p>
      <BalloonChart data={getUsageData()} />
    </section>
  )
}