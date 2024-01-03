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
    <Paper
      elevation={4}
      sx={{
        minHeight: "100%",
        backgroundColor: "white",
      }}
      square
    >
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
    </Paper>
  );
}
