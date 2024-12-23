import { Json } from './database'

export interface ProductionDetailsTable {
  Row: {
    id: number
    project_name: string
    client_name: string
    dimensions_ft: number
    colors: Json
    base_clusters: number
    extra_clusters: number
    total_clusters: number
    littles_quantity: number
    grapes_quantity: number
    balloons_11in: number
    balloons_16in: number
    accents: Json
    production_time: string | null
    creation_date: string | null
  }
  Insert: {
    id?: number
    project_name: string
    client_name: string
    dimensions_ft: number
    colors?: Json
    base_clusters: number
    extra_clusters: number
    total_clusters: number
    littles_quantity: number
    grapes_quantity: number
    balloons_11in: number
    balloons_16in: number
    accents?: Json
    production_time?: string | null
    creation_date?: string | null
  }
  Update: {
    id?: number
    project_name?: string
    client_name?: string
    dimensions_ft?: number
    colors?: Json
    base_clusters?: number
    extra_clusters?: number
    total_clusters?: number
    littles_quantity?: number
    grapes_quantity?: number
    balloons_11in?: number
    balloons_16in?: number
    accents?: Json
    production_time?: string | null
    creation_date?: string | null
  }
  Relationships: []
}