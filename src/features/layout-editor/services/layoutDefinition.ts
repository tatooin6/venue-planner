import type { ChairObject, LayoutDefinition, LayoutObject, TableObject } from '../types/layout'

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value)

const hasBaseProperties = (value: Record<string, unknown>): boolean =>
  typeof value.id === 'string' &&
  isFiniteNumber(value.x) &&
  isFiniteNumber(value.y) &&
  isFiniteNumber(value.rotation)

const isTable = (value: unknown): value is TableObject =>
  isRecord(value) &&
  value.type === 'table' &&
  hasBaseProperties(value) &&
  isFiniteNumber(value.number) &&
  (value.shape === 'rectangle' || value.shape === 'circle') &&
  isFiniteNumber(value.width) &&
  value.width > 0 &&
  isFiniteNumber(value.height) &&
  value.height > 0

const isChair = (value: unknown): value is ChairObject =>
  isRecord(value) &&
  value.type === 'chair' &&
  hasBaseProperties(value) &&
  (value.tableId === undefined || typeof value.tableId === 'string') &&
  (value.number === undefined || isFiniteNumber(value.number))

const isLayoutObject = (value: unknown): value is LayoutObject =>
  isTable(value) || isChair(value)

export function isLayoutDefinition(value: unknown): value is LayoutDefinition {
  return (
    isRecord(value) &&
    value.version === 1 &&
    isFiniteNumber(value.width) &&
    value.width > 0 &&
    isFiniteNumber(value.height) &&
    value.height > 0 &&
    Array.isArray(value.objects) &&
    value.objects.every(isLayoutObject)
  )
}

export function parseLayoutDefinition(json: string): LayoutDefinition {
  let parsed: unknown

  try {
    parsed = JSON.parse(json)
  } catch {
    throw new Error('The selected file is not valid JSON.')
  }

  if (!isLayoutDefinition(parsed)) {
    throw new Error('The selected JSON is not a supported layout definition.')
  }

  return parsed
}
