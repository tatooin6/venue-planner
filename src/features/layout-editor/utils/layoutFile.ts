import type { LayoutDefinition } from '../types/layout'

export function downloadLayoutDefinition(definition: LayoutDefinition, filename: string): void {
  const blob = new Blob([JSON.stringify(definition, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}
