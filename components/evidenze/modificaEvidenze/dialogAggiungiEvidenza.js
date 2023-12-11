import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";

export default function DialogAggiungiEvidenza({
  opened,
  handleClose,
  handleOnSubmit,
  dataList,
}) {
  const [open, setOpen] = React.useState(opened);
  const [selezionato, setSelezionato] = useState(undefined);
  React.useEffect(() => {
    setOpen(opened);
    setSelezionato(undefined);
  }, [opened]);
  //Submit
  const handleSubmit = () => {
    handleOnSubmit(selezionato);
    handleClose();
  };

  const handleTogglePartita = (obj) => {
    if (isSelezionato(obj)) {
      setSelezionato(undefined);
    } else {
      setSelezionato(obj);
    }
  };

  const isSelezionato = (obj) => {
    if (selezionato === undefined) return false;
    return selezionato.idFornituraCausaReclamo === obj.idFornituraCausaReclamo;
  };
  if (!dataList || !dataList.partitaList) return;
  return (
    <Dialog open={open} onClose={handleClose}>
      <Stack direction={"column"} p={2}>
        <DialogTitle>Aggiungi</DialogTitle>
        <Box>
          <List sx={{ width: "100%" }}>
            {dataList.partitaList.flatMap((p) =>
              p.causaReclamoList.map((fcr) => {
                const obj = {
                  idFornitura: p.id,
                  idFornituraCausaReclamo: fcr.id,
                  codiceFornitura: p.codice,
                  codiceCausaReclamo: fcr.codiceCausa,
                };
                return (
                  <ListItem key={p.id} disablePadding>
                    <ListItemButton
                      onClick={() => handleTogglePartita(obj)}
                      dense
                    >
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          checked={isSelezionato(obj)}
                          tabIndex={-1}
                          disableRipple
                        />
                      </ListItemIcon>
                      <ListItemText
                        id={fcr.id}
                        primary={p.codice}
                        secondary={
                          <>
                            <Typography variant="button">Causa: </Typography>
                            <b>{fcr.codiceCausa}</b>
                          </>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })
            )}
          </List>
          <Stack direction={"row-reverse"} spacing={1}>
            <Button
              onClick={() => handleSubmit()}
              disabled={selezionato === undefined}
              variant="contained"
            >
              Aggiungi
            </Button>
            <Button onClick={() => handleClose()} variant="outlined">
              Annulla
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Dialog>
  );
}
