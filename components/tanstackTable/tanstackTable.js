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
import { Popover, Button } from "@mui/material";
import { Checkbox } from "@mui/material";
import { ArrowDown2, ArrowRight2, ArrowSwapVertical, ArrowUp2, CloseSquare, Record, SearchNormal1, TickCircle, Trash } from "iconsax-react";
import dayjs from "dayjs";

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



  const handleRowClick = (row) => {
    row.toggleExpanded(); // Espande o riduce la riga
  };


  

  const columns = useMemo(
    () => [
    {
        id: "id",
        size: 10,
        enableResizing: false,
        header: ({ table}) => (
            <div className=" space-x-2 text-primary ">
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
                <button {...{ className: "text-center align-middle cursor-pointer"}}>
                    {row.getIsExpanded() ? <ArrowDown2 className="text-secondary" /> : <ArrowRight2  />}
                </button>
                </div>
            ) : (
                ''
            )
        },
    },
    
      {
        accessorKey: "numero",
        filterFn: 'includesString',
        header: () => <span className=" text-start p-1 ml-3 w-5/6 ">Reclamo</span>,
        cell: (info) => <a className=" text-orange-400 p-1 xl:ml-3 w-5/6 underline" >Reclamo {info.getValue()}</a>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row.evidenze,
        id: "evidenze",
        filterFn: 'includesString',
        header: () => <span  className=" text-start p-1 ml-3 w-5/6  ">Evidenze</span>,
        cell: (info) => <span className=" text-start p-1 xl:ml-3 w-5/6">{info.getValue()}</span>, 
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "partitaList",
        header: () => <span className=" text-start p-1 ml-3 w-5/6 ">Cause</span>,
        cell: (info) => <span className=" text-start p-1 xl:ml-3 w-5/6"> {info?.getValue()?.length > 0 ?info?.getValue()[0]?.causaReclamoList[0]?.codiceCausa : ""}</span>, 
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "descrizioneCliente",
        header: () => <span className=" text-start p-1 ml-3 w-5/6 ">Cliente</span>,
        cell: (info) => <span className=" text-start p-1 xl:ml-3 w-5/6 truncate" title={info.getValue()}>{info.getValue()}</span>, 
        footer: (props) => props.column.id,
      },
       {
        accessorKey: "descrizioneCliente",
        header: () => <span className=" text-start p-1 ml-3 w-5/6 ">Cliente</span>,
        cell: (info) => <span className=" text-start p-1 xl:ml-3 w-5/6 truncate" title={info.getValue()}>{info.getValue()}</span>, 
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "timestampCreazione",
        header: () => <span className=" text-start p-1 ml-3 w-5/6  ">Creazione</span>,
        cell: (info) => <span className=" text-start p-1 xl:ml-3 w-5/6">{dayjs(info.getValue()).format("DD/MM/YYYY")}</span>, 
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "codiceFase",
        header: () => <span className=" text-start p-1 ml-3 w-5/6  ">Fase</span>,
        cell: (info) => <span className=" text-start p-1 xl:ml-3 w-5/6">{info.getValue()}</span>, 
        footer: (props) => props.column.id,
      }
      
    ],
    []
  );

  const [fallbackData, setFallbackData] = useState(() => [
    {
      id: 1,
      numero: "Reclamo 1",
      evidenze: "Evidenza 1",
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


  <div className=" block max-w-full w-full h-[75vh] overflow-auto">
    {/* <div style={{ direction: table.options.columnResizeDirection,  }} > */}
      <table
        className="tanstakTable w-full "
        
      >
        <thead className="border-b-2 border-t-2">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="3xl:text-xl">
              {headerGroup.headers.map(header => {
                return (
                  <th key={header.id} colSpan={header.colSpan} className="items-center justify-between text-gray-500">
                  {header.isPlaceholder ? null : (
                    <>
                      <div
                       
                        className="cursor-pointer align-middle flex mt-2"
                      > 
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{
                          asc: <ArrowSwapVertical className="text-secondary w-5 text-end mt-1 mr-3"  onClick={header.column.getToggleSortingHandler()}/>,
                          desc: <ArrowSwapVertical className="text-secondary w-5 mt-1 mr-3"  onClick={header.column.getToggleSortingHandler()} />,
                        }[header.column.getIsSorted()] ?? (
                          header.column.getCanSort() ? <ArrowSwapVertical className="w-5 mt-1 mr-3"  onClick={header.column.getToggleSortingHandler()} /> : null
                        )}
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
            <Fragment key={row.id} >
            <tr className="hover:bg-slate-100 cursor-pointer border-t border-b 3xl:text-lg"  onClick={() => handleRowClick(row)}>
              {/* first row is a normal row */}
              {row.getVisibleCells().map(cell => {
                return (
                  <td key={cell.id} >

                    <div className=" my-1">
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

  
     </div>
     <div className="flex items-center gap-2 pt-20 ml-4 mb-4">
        <button
          className="border rounded p-4"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {'<<'}
        </button>
        <button
          className="border rounded p-4"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<'}
        </button>
        <button
          className="border rounded p-4"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {'>'}
        </button>
        <button
          className="border rounded p-4"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {'>>'}
        </button>
        <span className="flex items-center gap-1 ml-20">
          <div>Pagina</div>
          <strong >
            {table.getState().pagination.pageIndex + 1} di{' '}
            {table.getPageCount()}
          </strong>
        </span>
        <span className="flex items-center gap-1">
          | Vai a pagina:
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
        
        <div className="ml-20">
        <select
          value={table.getState().pagination.pageSize}
          onChange={e => {
            table.setPageSize(Number(e.target.value))
          }}
          className="mr-3"
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Mostra {pageSize}
            </option>
          ))}
        </select>
         righe per pagina
        </div>
      </div>
      <div className="ml-10 text-secondary">{table.getRowModel().rows.length} di {table.getPreFilteredRowModel().rows.length} totali</div>
      
    
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
    <Checkbox onClick={e => e.stopPropagation()} icon={<Record className={ rest.checked ? "text-secondary " : "text-primary  "} />} checkedIcon={<TickCircle className={ rest.checked ? "text-secondary " : "text-primary  "} variant="Bold" />} checked={rest.checked} ref={ref} {...rest} />
    
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
      <input  {...props} value={value} onChange={e => setValue(e.target.value) } className="w-full border font-medium p-2 shadow rounded " />
    )
  }


//Filtro per colonna
function Filter({ column }) {
  const columnFilterValue = column.getFilterValue();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
 
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div>
      <SearchNormal1  aria-describedby={id} variant="contained" onClick={handleClick} className="text-primary cursor-pointer mt-1 3xl:w-6 w-5" />
        
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <div className="p-2 flex">
          <DebouncedInput
          
            type="text"
            value={columnFilterValue ?? ''}
            onChange={value => column.setFilterValue(value)}
            placeholder={`Cerca...`}
          />
     
            
          <Button  onClick={() => column.setFilterValue(undefined)} variant="outlined" color="warning" className="ml-1 border-orange text-orange-300 cursor-pointer">Pulisci</Button>
          
        </div>
      </Popover>
    </div>
  );
}