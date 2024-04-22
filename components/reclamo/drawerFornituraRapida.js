import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  Divider,
  Drawer,
  IconButton,
  LinearProgress,
  Slide,
  Stack,
  SwipeableDrawer,
  Toolbar,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import useReclamoFornitura from "../fetching/useReclamoFornitura";
import ModificaDatiFornitura from "./datiFornitura/modificaDatiFornitura";
export default function DrawerFornituraRapida({ reclamo, onClose }) {
  const [opened, setOpened] = useState(false);
  const { data, trigger, isMutating, isLoading } = useReclamoFornitura(
    reclamo ? reclamo.id : null
  );
  useEffect(() => {
    setOpened(reclamo !== undefined);
    if (reclamo) trigger({ id: reclamo.id });
  }, [reclamo]);

  const closeDrawer = () => {
    setOpened(false);
    onClose();
  };
  if (!reclamo) return;
  return (
    <Dialog open={opened} onClose={closeDrawer} fullScreen>
      <Stack direction={"column"} p={2}>
        <Stack direction={"row"} alignContent={"start"}>
          <Stack width={"100%"}>
            <Typography variant="h5">
              Fornitura reclamo #{reclamo.numero}
            </Typography>
          </Stack>
          <IconButton onClick={() => closeDrawer()} size="small">
            <CloseIcon />
          </IconButton>
        </Stack>
        <Divider />
        {isMutating ? (
          <LinearProgress />
        ) : data ? (
          <Box>
            <ModificaDatiFornitura
              idReclamo={data.id}
              idForm={data.idForm}
              codiceValuta={data.codiceValuta}
              costoCartaAdesivo={data.costoCartaAdesivo}
              costoRibobinatrice={data.costoRibobinatrice}
              costoFermoMacchina={data.costoFermoMacchina}
              partitaList={data.partitaList}
              columnsData={data.columnData}
              exprValuta={data.exprValuta}
              onSubmit={() => {}}
              modificaLista={false}
              abilitaModifica={reclamo.modificaAbilitata}
            />
          </Box>
        ) : null}
      </Stack>
    </Dialog>
  );
}
