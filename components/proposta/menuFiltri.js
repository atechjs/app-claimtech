import { Button, Divider, Stack } from "@mui/material";
import LayoutMenuFiltri from "../menuFiltri/layoutMenuFiltri";
import BarFiltri from "./barFiltri";
import SyncIcon from "@mui/icons-material/Sync";

export default function MenuFiltri({
  filtroSelezionato,
  filterList,
  isLoading,
  onFilterSelected,
  onSync,
}) {
  return (
    <LayoutMenuFiltri
      barFiltri={<BarFiltri />}
      filterList={filterList}
      filtroSelezionato={filtroSelezionato}
      onFilterSelected={onFilterSelected}
      isLoading={isLoading}
    >
      <Stack pl={1} pr={1}>
        <Button
          variant="outlined"
          onClick={() => onSync()}
          startIcon={<SyncIcon />}
          size="medium"
        >
          Ricarica
        </Button>
      </Stack>
      <Divider sx={{ marginBottom: 0 }} />
    </LayoutMenuFiltri>
  );
}
