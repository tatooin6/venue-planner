import type { Layout, SaveLayoutInput } from '../types/layout'

export interface LayoutRepository {
  save(layout: SaveLayoutInput): Promise<Layout>
  findById(id: string): Promise<Layout | null>
  findAll(): Promise<Layout[]>
  delete(id: string): Promise<void>
}
