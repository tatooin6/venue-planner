import { supabase } from '../../../lib/supabase/client'
import { isLayoutDefinition } from '../services/layoutDefinition'
import type { Layout, SaveLayoutInput } from '../types/layout'
import type { LayoutRepository } from './LayoutRepository'

interface LayoutRow {
  id: string
  name: string
  definition: unknown
  created_at: string
  updated_at: string
}

function mapRow(row: LayoutRow): Layout {
  if (!isLayoutDefinition(row.definition)) {
    throw new Error(`Layout ${row.id} has an invalid stored definition.`)
  }

  return {
    id: row.id,
    name: row.name,
    definition: row.definition,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export class SupabaseLayoutRepository implements LayoutRepository {
  async save(layout: SaveLayoutInput): Promise<Layout> {
    const payload = { id: layout.id, name: layout.name, definition: layout.definition }
    const query = layout.id
      ? supabase.from('layouts').upsert(payload, { onConflict: 'id' })
      : supabase.from('layouts').insert({ name: layout.name, definition: layout.definition })
    const { data, error } = await query.select('id, name, definition, created_at, updated_at').single()

    if (error) {
      throw new Error(`Unable to save layout: ${error.message}`)
    }

    return mapRow(data)
  }

  async findById(id: string): Promise<Layout | null> {
    const { data, error } = await supabase
      .from('layouts')
      .select('id, name, definition, created_at, updated_at')
      .eq('id', id)
      .maybeSingle()

    if (error) throw new Error(`Unable to load layout: ${error.message}`)
    return data ? mapRow(data) : null
  }

  async findAll(): Promise<Layout[]> {
    const { data, error } = await supabase
      .from('layouts')
      .select('id, name, definition, created_at, updated_at')
      .order('updated_at', { ascending: false })

    if (error) throw new Error(`Unable to load layouts: ${error.message}`)
    return data.map(mapRow)
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('layouts').delete().eq('id', id)
    if (error) throw new Error(`Unable to delete layout: ${error.message}`)
  }
}

export const layoutRepository: LayoutRepository = new SupabaseLayoutRepository()
