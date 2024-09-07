import { Divider, LinearProgress, List, Paper, Stack } from "@mui/material";
import ItemFiltro from "./itemFiltro";

import DraggableFiltri from "../reclamiAssegnati/draggableFiltri";
import { Pharagraphspacing } from "iconsax-react";
import { useMemo } from "react";
import { useSortable } from "@dnd-kit/sortable";

export default function LayoutMenuFiltri({
  barFiltri,
  filterList,
  filtroSelezionato,
  onFilterSelected,
  isLoading,
  children,
}) {

  const RowDragHandleCell = ({ rowId }) => {
    const { attributes, listeners } = useSortable({
      id: rowId,
    })
    return (
     
      <Pharagraphspacing className='text-secondary' {...attributes} {...listeners}>
        🟰
      </Pharagraphspacing>
    )
  }

  const columns = useMemo(
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
        cell: info => <p className='text-gray-600 2xl:text-lg text-base'>{info.getValue()}</p>, 
      },
     
      {
        accessorKey: 'count', 
        cell: info => 
        <div className='flex items-center justify-center'>
        <span className="bg-orange-200 px-3 py-1 font-bold rounded-xl  2xl:text-lg text-base text-orange-400" >{info.getValue()}</span>
        </div>,
      },
      
    ],
    []
  )
  return (
<div class="break-inside-avoid-column space-y-4" >
  <div class=" text-gray-500 w-full  p-3  h-[30vh] lg:h-[88vh] overflow-auto rounded-2xl" style={{ backgroundColor: "#fff" }}>
    
      <Stack direction={"column"} spacing={1}>
        {barFiltri}
        {children}
        <Stack direction={"column"}>
          {isLoading !== undefined && !isLoading ? (
            <>
            {/* <List dense sx={{ pt: 0 }}>
              {filterList &&
                filterList.map((filtro) => (
                  <ItemFiltro
                    filtro={filtro}
                    filtroSelezionato={filtroSelezionato}
                    onFilterSelected={onFilterSelected}
                  />
                ))}
            </List> */}
              <DraggableFiltri filtroSelezionato={filtroSelezionato} onFilterSelected={onFilterSelected} stdData={filterList}/>
              </>
          ) : (
            <Stack direction={"column"}>
              <LinearProgress thickness={10} />
            </Stack>
          )}
        </Stack>
      </Stack>
   </div>

</div>
  );
}
