import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { signOut } from '../features/auth/services/authService'
import { LayoutCanvas } from '../features/layout-editor/components/LayoutCanvas'
import { layoutRepository } from '../features/layout-editor/repositories/SupabaseLayoutRepository'
import { parseLayoutDefinition } from '../features/layout-editor/services/layoutDefinition'
import { useLayoutEditorStore } from '../features/layout-editor/store/useLayoutEditorStore'
import type { Layout } from '../features/layout-editor/types/layout'
import { downloadLayoutDefinition } from '../features/layout-editor/utils/layoutFile'
import { TicketSpike } from '../features/spike/components/TicketSpike'

export function AppPage() {
  const layoutId = useLayoutEditorStore((state) => state.layoutId)
  const layoutName = useLayoutEditorStore((state) => state.layoutName)
  const definition = useLayoutEditorStore((state) => state.definition)
  const selectedObjectId = useLayoutEditorStore((state) => state.selectedObjectId)
  const addTable = useLayoutEditorStore((state) => state.addTable)
  const addChair = useLayoutEditorStore((state) => state.addChair)
  const deleteObject = useLayoutEditorStore((state) => state.deleteObject)
  const loadLayout = useLayoutEditorStore((state) => state.loadLayout)
  const loadDefinition = useLayoutEditorStore((state) => state.loadDefinition)
  const resetLayout = useLayoutEditorStore((state) => state.resetLayout)
  const [layouts, setLayouts] = useState<Layout[]>([])
  const [status, setStatus] = useState<string>()
  const [error, setError] = useState<string>()
  const [isSaving, setIsSaving] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function refreshLayouts() {
    try {
      setLayouts(await layoutRepository.findAll())
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to load layouts.')
    }
  }

  useEffect(() => {
    queueMicrotask(() => { void refreshLayouts() })
  }, [])

  async function saveLayout() {
    setStatus(undefined)
    setError(undefined)
    setIsSaving(true)
    try {
      const saved = await layoutRepository.save({ id: layoutId, name: layoutName, definition })
      loadLayout(saved)
      setStatus('Layout saved remotely.')
      await refreshLayouts()
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to save layout.')
    } finally {
      setIsSaving(false)
    }
  }

  async function importLayout(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    setStatus(undefined)
    setError(undefined)
    try {
      loadDefinition(parseLayoutDefinition(await file.text()))
      setStatus('Layout imported into the editor. Save it to persist remotely.')
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to import layout.')
    }
  }

  return <main className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6"><header className="flex flex-wrap items-center justify-between gap-3"><div><h1 className="text-2xl font-semibold">Layout Spike</h1><p className="text-sm text-slate-600">Deployment-first walking skeleton</p></div><button className="rounded border border-slate-300 bg-white px-4 py-2 text-sm" type="button" onClick={() => void signOut()}>Logout</button></header><section className="space-y-4 rounded-lg border border-slate-200 bg-white p-4"><div className="flex flex-wrap gap-2"><button className="rounded border border-slate-300 px-3 py-2 text-sm" type="button" onClick={resetLayout}>New Layout</button><button className="rounded bg-blue-600 px-3 py-2 text-sm font-medium text-white disabled:opacity-50" type="button" disabled={isSaving} onClick={() => void saveLayout()}>{isSaving ? 'Saving...' : 'Save Layout'}</button><button className="rounded border border-slate-300 px-3 py-2 text-sm" type="button" onClick={() => downloadLayoutDefinition(definition, 'spike-layout.json')}>Export JSON</button><button className="rounded border border-slate-300 px-3 py-2 text-sm" type="button" onClick={() => inputRef.current?.click()}>Import JSON</button><input ref={inputRef} className="hidden" type="file" accept="application/json,.json" onChange={(event) => void importLayout(event)} /></div><div className="flex flex-wrap gap-2"><button className="rounded bg-slate-800 px-3 py-2 text-sm text-white" type="button" onClick={addTable}>Add table</button><button className="rounded bg-slate-800 px-3 py-2 text-sm text-white" type="button" onClick={addChair}>Add chair</button><button className="rounded border border-red-300 px-3 py-2 text-sm text-red-700 disabled:opacity-50" type="button" disabled={!selectedObjectId} onClick={deleteObject}>Delete selected</button></div>{status && <p className="text-sm text-green-700" role="status">{status}</p>}{error && <p className="rounded bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p>}<LayoutCanvas /></section><section className="rounded-lg border border-slate-200 bg-white p-5"><h2 className="font-semibold">Saved layouts</h2><div className="mt-3 flex flex-wrap gap-2">{layouts.length === 0 ? <p className="text-sm text-slate-600">No saved layouts yet.</p> : layouts.map((layout) => <button className="rounded border border-slate-300 px-3 py-2 text-sm" type="button" key={layout.id} onClick={() => loadLayout(layout)}>{layout.name}</button>)}</div></section><TicketSpike /></main>
}
