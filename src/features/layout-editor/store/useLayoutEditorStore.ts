import { create } from 'zustand'
import type { ChairObject, Layout, LayoutDefinition, TableObject } from '../types/layout'

const canvasSize = { width: 900, height: 560 }

interface LayoutEditorState {
  layoutId?: string
  layoutName: string
  definition: LayoutDefinition
  selectedObjectId?: string
  addTable: () => void
  addChair: () => void
  moveObject: (id: string, x: number, y: number) => void
  selectObject: (id?: string) => void
  deleteObject: () => void
  loadLayout: (layout: Layout) => void
  loadDefinition: (definition: LayoutDefinition, name?: string) => void
  resetLayout: () => void
}

const emptyDefinition = (): LayoutDefinition => ({ version: 1, ...canvasSize, objects: [] })

export const useLayoutEditorStore = create<LayoutEditorState>((set) => ({
  layoutName: 'Spike Layout',
  definition: emptyDefinition(),
  addTable: () =>
    set((state) => {
      const table: TableObject = {
        id: crypto.randomUUID(), type: 'table', number: state.definition.objects.filter((object) => object.type === 'table').length + 1,
        shape: 'rectangle', width: 120, height: 70, x: 180, y: 150, rotation: 0,
      }
      return { definition: { ...state.definition, objects: [...state.definition.objects, table] }, selectedObjectId: table.id }
    }),
  addChair: () =>
    set((state) => {
      const chair: ChairObject = { id: crypto.randomUUID(), type: 'chair', x: 120, y: 120, rotation: 0 }
      return { definition: { ...state.definition, objects: [...state.definition.objects, chair] }, selectedObjectId: chair.id }
    }),
  moveObject: (id, x, y) => set((state) => ({
    definition: {
      ...state.definition,
      objects: state.definition.objects.map((object) => object.id === id ? { ...object, x, y } : object),
    },
  })),
  selectObject: (selectedObjectId) => set({ selectedObjectId }),
  deleteObject: () => set((state) => ({
    definition: { ...state.definition, objects: state.definition.objects.filter((object) => object.id !== state.selectedObjectId) },
    selectedObjectId: undefined,
  })),
  loadLayout: (layout) => set({ layoutId: layout.id, layoutName: layout.name, definition: layout.definition, selectedObjectId: undefined }),
  loadDefinition: (definition, name = 'Imported Spike Layout') => set({ layoutId: undefined, layoutName: name, definition, selectedObjectId: undefined }),
  resetLayout: () => set({ layoutId: undefined, layoutName: 'Spike Layout', definition: emptyDefinition(), selectedObjectId: undefined }),
}))
