import { useEffect, useState, useMemo, useRef, Fragment } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getExpandedRowModel,
  getPaginationRowModel,
  createColumnHelper,
  flexRender,
  getFilteredRowModel,
  getSortedRowModel,
  ColumnFiltersState,
  filterFn,
  SortingState
} from "@tanstack/react-table";
import { Checkbox } from "@mui/material";
import { ArrowDown2, ArrowRight2, ArrowUp2, Record, TickCircle } from "iconsax-react";

export default function TanstackTable({ data }) {
  // Resizable column
  const [columnResizeMode, setColumnResizeMode] = useState("onChange");
  const [columnResizeDirection, setColumnResizeDirection] = useState("ltr");

  // Expandable rows
  const [expanded, setExpanded] = useState({});

  //Ordinamento
  const [sorting, setSorting] = useState([])

  //Filtri
  const [columnFilters, setColumnFilters] = useState([])

const renderSubComponent = ({ row }) => {
    return (
      <pre style={{ fontSize: '10px' }}>
        <code>{JSON.stringify(row.original, null, 2)}</code>
      </pre>
    )
  }



  const columns = useMemo(
    () => [
    {
        id: "id",
        header: ({ table}) => (
            <div className=" space-x-2 text-primary ml-3 ">
             <IndeterminateCheckbox
              {...{
                checked: table.getIsAllRowsSelected(),
                indeterminate: table.getIsSomeRowsSelected(),
                onChange: table.getToggleAllRowsSelectedHandler(),
              }}
            />
       
            <button {...{ onClick: table.getToggleAllRowsExpandedHandler() }} className="text-center align-middle">
              {table.getIsAllRowsExpanded() ? <ArrowDown2 className="text-secondary" /> : <ArrowRight2  />}
            </button>
           
            </div>
        ),
        cell: ( { row }) => {
            return row.getCanExpand() ? (
                <div className="text-start space-x-2 ">
                <IndeterminateCheckbox
                {...{
                    checked: row.getIsSelected(),
                    onChange: row.getToggleSelectedHandler(),
                    indeterminate: row.getIsSomeSelected()
                }} /> 
                <button {...{onClick: row.getToggleExpandedHandler(), className: "text-center align-middle cursor-pointer"}}>
                    {row.getIsExpanded() ? <ArrowDown2 className="text-secondary" /> : <ArrowRight2  />}
                </button>
                </div>
            ) : (
                ''
            )
        },
    },
    
      {
        accessorKey: "reclamo",
        filterFn: 'includesString',
        header: () => <span className="text-primary text-start p-1 ml-3 w-5/6">Reclamo</span>,
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row.evidenze,
        id: "evidenze",
        filterFn: 'includesString',
        cell: (info) => info.getValue(),
        header: () => <span className="text-primary p-1">Evidenze</span>,
        footer: (props) => props.column.id,
      },
    ],
    []
  );

  const [fallbackData, setFallbackData] = useState(() => [
    {
      id: 1,
      reclamo: "Reclamo 1",
      evidenze: "Evidenza 1",
      sottoRighe: [
        {
            reclamo: "Reclamo 1.1",
            evidenze: "Evidenza 1.1",
        }
      ]
      
    },
    {
        id: 2,
        reclamo: "Reclamo 21",
        evidenze: "Evidenza 2",
        sottoRighe: [
          {
              reclamo: "Reclamo 1.1",
              evidenze: "Evidenza 1.1",
          }
        ]
        
      },
  ]);

  // Use data if provided, otherwise fallback to fallbackData
  const tableData = data ?? fallbackData;

  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    getRowCanExpand : () => true,
    columnResizeMode,
    columnResizeDirection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
       
  });

  
  return (
<>

    <div>
    {/* <DebouncedInput
          value={globalFilter ?? ''}
          onChange={value => setGlobalFilter(String(value))}
          className="p-2 mb-8 font-lg shadow border border-block"
          placeholder="Cerca in tutte le colonne..."
        /> */}
  </div>



    <div style={{ direction: table.options.columnResizeDirection,  }} >
      <table
        className="tanstakTable"
        
      >
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                return (
                <th key={header.id} colSpan={header.colSpan} style={{ width: header.getSize() }}>
                  {header.isPlaceholder ? null : (
                    <>
                    <div
                    onClick={header.column.getToggleSortingHandler()}
                      title={
                        header.column.getCanSort()
                          ? header.column.getNextSortingOrder() === 'asc'
                            ? 'Ordine crescente'
                            : header.column.getNextSortingOrder() === 'desc'
                              ? 'Ordine decrescente'
                              : 'Annulla ordinamento'
                          : undefined
                      }
                      className="cursor-pointer align-middle flex mt-2"
                    > 
                      <div 
                        onDoubleClick={() => header.column.resetSize()}
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        className={`resizer ${table.options.columnResizeDirection} ${
                          header.column.getIsResizing() ? "isResizing" : ""
                        }`}
                      />
                      
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{
                          asc: <ArrowUp2 className="text-secondary text-end mt-1 mr-3" />,
                          desc: <ArrowDown2 className="text-secondary  mt-1 mr-3" />,
                      }[header.column.getIsSorted()] ?? null}
                    </div>
                       <div className="flex-none">
                        {header.column.getCanFilter() ? <Filter column={header.column} /> : null}
                      </div>
                    </>
              
                    )}
                    
                </th>
                ) 
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <Fragment key={row.id}>
            <tr>
              {/* first row is a normal row */}
              {row.getVisibleCells().map(cell => {
                return (
                  <td key={cell.id} >

                    <div className="ml-3 my-1">
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                    </div>
                  </td>
                )
              })}
            </tr>
            {row.getIsExpanded() && (
              <tr>
                {/* 2nd row is a custom 1 cell row */}
                <td></td>
                <td colSpan={row.getVisibleCells().length -1}>
                  {renderSubComponent({ row })}
                </td>
              </tr>
            )}
          </Fragment>
          ))}
        </tbody>
      </table>

    

      <div className="h-2" />
      <div className="flex items-center gap-2">
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {'<<'}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<'}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {'>'}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {'>>'}
        </button>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </strong>
        </span>
        <span className="flex items-center gap-1">
          | Go to page:
          <input
            type="number"
            min="1"
            max={table.getPageCount()}
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              table.setPageIndex(page)
            }}
            className="border p-1 rounded w-16"
          />
        </span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={e => {
            table.setPageSize(Number(e.target.value))
          }}
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
      <div>{table.getRowModel().rows.length} Rows</div>
      <div> {table.getPreFilteredRowModel().rows.length} Total Rows Selected</div>
    </div>
    </>
  );
}


//Checkbox per selezionare riga
function IndeterminateCheckbox({ indeterminate, className = "", ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    if (typeof indeterminate === "boolean") {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate]);

  return (
    <Checkbox icon={<Record className={ rest.checked ? "text-secondary " : "text-primary  "} />} checkedIcon={<TickCircle className={ rest.checked ? "text-secondary " : "text-primary  "} variant="Bold" />} checked={rest.checked} ref={ref} {...rest} />
    
  )
   }


   //Barra di ricerca
  function DebouncedInput({
    value: initialValue,
    onChange,
    debounce = 500,
    ...props
  }) {
    const [value, setValue] = useState(initialValue)
  
    useEffect(() => {
      setValue(initialValue)
    }, [initialValue])
  
    useEffect(() => {
      const timeout = setTimeout(() => {
        onChange(value)
      }, debounce)
  
      return () => clearTimeout(timeout)
    }, [value])
  
    return (
      <input  {...props} value={value} onChange={e => setValue(e.target.value) } className="w-[90%] border font-medium m-1 p-1 shadow rounded mb-3" />
    )
  }


//Filtro per colonna
function Filter({ column }) {
  const columnFilterValue = column.getFilterValue()

  return (
    <DebouncedInput
      type="text"
      value={(columnFilterValue ?? '')}
      onChange={value => column.setFilterValue(value)}
      placeholder={`Cerca...`}
      
    />
  )
}