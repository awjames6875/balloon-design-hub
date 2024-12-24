export interface InventoryItem {
  color: string
  size: string
  quantity: number
  required: number
  status: 'in-stock' | 'low' | 'out-of-stock'
}

export interface ColorCluster {
  color: string
  baseClusters: number
  extraClusters: number
}

export interface Calculations {
  balloons11in: number
  balloons16in: number
}