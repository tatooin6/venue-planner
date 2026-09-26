export type TableShape = 'rectangle' | 'circle'

export interface BaseLayoutObject {
  id: string
  x: number
  y: number
  rotation: number
}

export interface TableObject extends BaseLayoutObject {
  type: 'table'
  number: number
  shape: TableShape
  width: number
  height: number
}

export interface ChairObject extends BaseLayoutObject {
  type: 'chair'
  tableId?: string
  number?: number
}

export type LayoutObject = TableObject | ChairObject

export interface LayoutDefinition {
  version: 1
  width: number
  height: number
  objects: LayoutObject[]
}

export interface Layout {
  id: string
  name: string
  definition: LayoutDefinition
  createdAt: string
  updatedAt: string
}

export interface SaveLayoutInput {
  id?: string
  name: string
  definition: LayoutDefinition
}
