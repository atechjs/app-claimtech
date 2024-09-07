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
    <ListItem key={filtro.id} disablePadding className="cursor-pointer">
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
          className="p-2"
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              width: "100%",
            }}
          >
            {filtro.pinned ? <PushPinTwoToneIcon className="text-secondary " fontSize="medium" /> : <></>}
            <p className={(filtro.pinned ? " ml-2" : " ml-7") + " text-gray-600 2xl:text-lg text-base" }>{filtro.label} </p>
          </Box>
          <Stack direction={"row-reverse"} spacing={0}>
            {filtro.count !== undefined && filtro.count !== null ? (
              <span className="bg-orange-200 px-3 py-1 font-bold rounded-xl  2xl:text-lg text-base text-orange-400" >{filtro.count}</span>
            ) : null}
          </Stack>
        </Stack>
      </ListItemButton>
    
    </ListItem>
  );
}
