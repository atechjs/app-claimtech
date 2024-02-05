import { Box, ListItemButton, ListItemText, Stack } from "@mui/material";
import { ListItem } from "@mui/material";
import Tag from "../tag";
import PushPinTwoToneIcon from "@mui/icons-material/PushPinTwoTone";

export default function ItemFiltro({
  filtro,
  filtroSelezionato,
  onFilterSelected,
}) {
  if (filtro === undefined) return;
  return (
    <ListItem key={filtro.id} disablePadding>
      <ListItemButton
        sx={{ pr: 1, pl: 1 }}
        onClick={() => onFilterSelected(filtro)}
        selected={
          filtroSelezionato !== undefined && filtro.id === filtroSelezionato
        }
      >
        <Stack
          direction="row"
          width={"100%"}
          justifyContent="flex-start"
          alignItems="center"
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              width: "100%",
            }}
          >
            {filtro.pinned ? <PushPinTwoToneIcon fontSize="small" /> : <></>}
            <ListItemText primary={filtro.label} />
          </Box>
          <Stack direction={"row-reverse"} spacing={0}>
            {filtro.count !== undefined && filtro.count !== null ? (
              <Tag label={filtro.count} colore="gray" />
            ) : null}
          </Stack>
        </Stack>
      </ListItemButton>
    </ListItem>
  );
}
