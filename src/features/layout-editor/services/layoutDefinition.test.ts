import { describe, expect, it } from 'vitest'
import { isLayoutDefinition, parseLayoutDefinition } from './layoutDefinition'

const validDefinition = { version: 1, width: 900, height: 560, objects: [{ id: 'table-1', type: 'table', x: 10, y: 20, rotation: 0, number: 1, shape: 'rectangle', width: 120, height: 70 }] }

describe('layout definition validation', () => {
  it('accepts a serializable layout definition', () => expect(isLayoutDefinition(validDefinition)).toBe(true))
  it('rejects objects with unsupported types', () => expect(isLayoutDefinition({ ...validDefinition, objects: [{ ...validDefinition.objects[0], type: 'wall' }] })).toBe(false))
  it('reports invalid JSON files', () => expect(() => parseLayoutDefinition('{')).toThrow('not valid JSON'))
})
