
export interface InventoryItem {
  color: string
  size: string
  quantity: number
  required: number
  status: 'in-stock' | 'low' | 'out-of-stock'
  remaining?: number
}

export interface ColorCluster {
  color: string
  baseClusters: number
  extraClusters: number
}

export interface Calculations {
  baseClusters: number
  extraClusters: number
  totalClusters: number
  littlesQuantity: number
  grapesQuantity: number
  balloons11in: number
  balloons16in: number
  totalBalloons: number
}

// Add export for ColorBalloonData type which was already in services/inventory/types.ts
export type { ColorBalloonData } from '@/services/inventory/types'
