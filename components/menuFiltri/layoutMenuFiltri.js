import { Divider, LinearProgress, List, Paper, Stack } from "@mui/material";
import ItemFiltro from "./itemFiltro";

export default function LayoutMenuFiltri({
  barFiltri,
  filterList,
  filtroSelezionato,
  onFilterSelected,
  isLoading,
  children,
}) {
  return (
<div class="break-inside-avoid-column space-y-4" >
  <div class=" text-gray-500 w-full  p-3 h-[95vh] rounded-2xl" style={{ backgroundColor: "#fff" }}>
    
      <Stack direction={"column"} spacing={1}>
        {barFiltri}
        {children}
        <Stack direction={"column"}>
          {isLoading !== undefined && !isLoading ? (
            <List dense sx={{ pt: 0 }}>
              {filterList &&
                filterList.map((filtro) => (
                  <ItemFiltro
                    filtro={filtro}
                    filtroSelezionato={filtroSelezionato}
                    onFilterSelected={onFilterSelected}
                  />
                ))}
            </List>
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
