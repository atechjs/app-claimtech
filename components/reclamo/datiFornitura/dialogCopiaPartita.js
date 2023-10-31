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
import useCausaSelect from "../../fetching/useCausaSelect";

export default function DialogCopiaPartita({
  opened,
  handleClose,
  handleOnSubmit,
  partitaList,
}) {
  const [open, setOpen] = React.useState(opened);
  const [indexPartitaSelezionata, setIndexPartitaSelezionata] =
    useState(undefined);

  const { causaList } = useCausaSelect();

  React.useEffect(() => {
    setOpen(opened);
    setIndexPartitaSelezionata(undefined);
  }, [opened]);

  //Submit
  const handleSubmit = () => {
    handleOnSubmit(indexPartitaSelezionata);
    handleClose();
  };

  const handleTogglePartita = (index) => {
    if (isPartitaSelezionata(index)) setIndexPartitaSelezionata(undefined);
    else setIndexPartitaSelezionata(index);
  };

  const isPartitaSelezionata = (index) => {
    if (indexPartitaSelezionata === undefined) return false;
    return indexPartitaSelezionata === index;
  };
  if (!causaList)
    return (
      <Dialog open={open}>
        <CircularProgress />
      </Dialog>
    );
  return (
    <Dialog open={open} onClose={handleClose}>
      <Stack direction={"column"} p={2}>
        <DialogTitle>Copia</DialogTitle>
        <Box>
          <List sx={{ width: "100%" }}>
            {partitaList.map((partita, index) => {
              return (
                <ListItem key={partita.codice} disablePadding>
                  <ListItemButton
                    onClick={() => handleTogglePartita(index)}
                    dense
                  >
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={isPartitaSelezionata(index)}
                        tabIndex={-1}
                        disableRipple
                      />
                    </ListItemIcon>
                    <ListItemText
                      id={partita.codice}
                      primary={partita.codice}
                      secondary={
                        <>
                          <Typography variant="button">Causa: </Typography>
                          <b>
                            {
                              causaList.find(
                                (x) =>
                                  x.value ===
                                  partita.partitaCausaReclamo_idCausa
                              ).label
                            }
                          </b>
                        </>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
          <Stack direction={"row-reverse"} spacing={1}>
            <Button
              onClick={() => handleSubmit()}
              disabled={indexPartitaSelezionata === undefined}
              variant="contained"
              color="info"
            >
              Copia
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
