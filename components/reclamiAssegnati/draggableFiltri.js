import React from 'react'

import { flexRender, getCoreRowModel, useReactTable,} from '@tanstack/react-table'

import { DndContext, KeyboardSensor, MouseSensor, TouchSensor, closestCenter, useSensor, useSensors,} from '@dnd-kit/core'

import { restrictToVerticalAxis } from '@dnd-kit/modifiers'

import {arrayMove, SortableContext, verticalListSortingStrategy,} from '@dnd-kit/sortable'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Pharagraphspacing } from 'iconsax-react'

// Cell Component
const RowDragHandleCell = ({ rowId }) => {
  const { attributes, listeners } = useSortable({
    id: rowId,
  })
  return (
   
    <Pharagraphspacing className='text-secondary 3xl:w-6 w-4' {...attributes} {...listeners} />
  )
}

// Row Component
const DraggableRow = ({ row, onClick, filtroSelezionato }) => {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform), //let dnd-kit do its thing
    transition: transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1 : 0,
    position: 'relative',
  }
  return (
    
    <tr ref={setNodeRef} style={style} className={'hover:bg-orange-100 ' + (row.id === filtroSelezionato ? 'bg-orange-50' : '')} onClick={onClick} >
      {row.getVisibleCells().map(cell => (
        <td key={cell.id} className='p-3 cursor-pointer' >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </tr>
  )
}




export default function draggableFiltri({stdData, filtroSelezionato, onFilterSelected }) {
  const columns = React.useMemo(
    () => [
     
      {
        id: 'drag-handle',
        header: 'Move',
        cell: ({ row }) => 
          <div className='flex items-center justify-center'>
            <RowDragHandleCell rowId={row.original.id} />
          </div>,
        size: 60,
      },
      {
        accessorKey: 'label',
        cell: info => <p className='text-gray-600 3xl:text-lg text-sm'>{info.getValue()}</p>, 
      },
     
      {
        accessorKey: 'count', 
        cell: info => 
        <div className='flex items-center justify-center'>
        <span className="bg-orange-200 px-2 3xl:px-3 3xl:py-1 font-bold 3xl:rounded-xl rounded-lg 2xl:text-lg text-base text-orange-400" >{info.getValue()}</span>
        </div>,
      },
      
    ],
    []
  )

  if (!stdData) return null

  const [data, setData] = React.useState(stdData);


  

  const dataIds = React.useMemo(
    () => data?.map(({ id }) => id),
    [data]
  )

 
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: row => row.id, //required because row indexes will change
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
  })
  
  if (!table) return null

  // reorder rows after drag & drop
  function handleDragEnd(event) {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      setData(data => {
        const oldIndex = dataIds.indexOf(active.id)
        const newIndex = dataIds.indexOf(over.id)
        return arrayMove(data, oldIndex, newIndex) //this is just a splice util
      })
    }
  }

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  )

  return (
    // NOTE: This provider creates div elements, so don't nest inside of <table> elements
    <DndContext
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis]}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
     
        <div className="w-full" />
        <table>
        
          <tbody>
            <SortableContext
              items={dataIds}
              strategy={verticalListSortingStrategy}
            >
              {table.getRowModel().rows.map(row => (
               
                <DraggableRow key={row.original.id} row={row} onClick={() => onFilterSelected(row.original)} filtroSelezionato={filtroSelezionato} />
              ))}
            </SortableContext>
          </tbody>
        </table>
      
      
    </DndContext>
  )
}

