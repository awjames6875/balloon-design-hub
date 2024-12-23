import { Json } from './database'

export interface BalloonFormulaTable {
  Row: {
    id: number
    size_ft: number
    base_clusters: number
    extra_clusters: number
    total_clusters: number
    littles_quantity: number
    grapes_quantity: number
    balloons_11in: number
    balloons_16in: number
    total_balloons: number
    accents: Json | null
  }
  Insert: {
    id?: number
    size_ft: number
    base_clusters: number
    extra_clusters: number
    total_clusters: number
    littles_quantity: number
    grapes_quantity: number
    balloons_11in: number
    balloons_16in: number
    total_balloons: number
    accents?: Json | null
  }
  Update: {
    id?: number
    size_ft?: number
    base_clusters?: number
    extra_clusters?: number
    total_clusters?: number
    littles_quantity?: number
    grapes_quantity?: number
    balloons_11in?: number
    balloons_16in?: number
    total_balloons?: number
    accents?: Json | null
  }
  Relationships: []
}