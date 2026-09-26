import { Circle, Group, Layer, Rect, Stage, Text } from 'react-konva'
import { useLayoutEditorStore } from '../store/useLayoutEditorStore'
import type { ChairObject, TableObject } from '../types/layout'

function TableNode({ table, selected }: { table: TableObject; selected: boolean }) {
  const moveObject = useLayoutEditorStore((state) => state.moveObject)
  const selectObject = useLayoutEditorStore((state) => state.selectObject)
  const common = { x: table.x, y: table.y, rotation: table.rotation, draggable: true, onClick: () => selectObject(table.id), onTap: () => selectObject(table.id), onDragEnd: (event: { target: { x: () => number; y: () => number } }) => moveObject(table.id, event.target.x(), event.target.y()) }
  return <Group {...common}>{table.shape === 'circle' ? <Circle radius={table.width / 2} fill="#cbd5e1" stroke={selected ? '#2563eb' : '#475569'} strokeWidth={selected ? 3 : 1} /> : <Rect width={table.width} height={table.height} offsetX={table.width / 2} offsetY={table.height / 2} fill="#cbd5e1" stroke={selected ? '#2563eb' : '#475569'} strokeWidth={selected ? 3 : 1} cornerRadius={4} />}<Text text={`T${table.number}`} width={table.width} offsetX={table.width / 2} offsetY={8} align="center" fontSize={14} fill="#0f172a" /></Group>
}

function ChairNode({ chair, selected }: { chair: ChairObject; selected: boolean }) {
  const moveObject = useLayoutEditorStore((state) => state.moveObject)
  const selectObject = useLayoutEditorStore((state) => state.selectObject)
  return <Rect x={chair.x} y={chair.y} rotation={chair.rotation} width={28} height={28} offsetX={14} offsetY={14} fill="#f8fafc" stroke={selected ? '#2563eb' : '#64748b'} strokeWidth={selected ? 3 : 1} cornerRadius={3} draggable onClick={() => selectObject(chair.id)} onTap={() => selectObject(chair.id)} onDragEnd={(event) => moveObject(chair.id, event.target.x(), event.target.y())} />
}

export function LayoutCanvas() {
  const definition = useLayoutEditorStore((state) => state.definition)
  const selectedObjectId = useLayoutEditorStore((state) => state.selectedObjectId)
  const selectObject = useLayoutEditorStore((state) => state.selectObject)
  return <div className="overflow-auto rounded border border-slate-300 bg-white"><Stage width={definition.width} height={definition.height} onMouseDown={(event) => { if (event.target === event.target.getStage()) selectObject() }}><Layer>{definition.objects.map((object) => object.type === 'table' ? <TableNode key={object.id} table={object} selected={object.id === selectedObjectId} /> : <ChairNode key={object.id} chair={object} selected={object.id === selectedObjectId} />)}</Layer></Stage></div>
}
