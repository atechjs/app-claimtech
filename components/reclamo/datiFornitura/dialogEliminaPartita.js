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

export default function DialogEliminaPartita({
  opened,
  handleClose,
  handleOnSubmit,
  partitaList,
}) {
  const [open, setOpen] = React.useState(opened);
  const [indexPartiteSelezionateList, setIndexPartiteSelezionateList] =
    useState([]);
  React.useEffect(() => {
    setOpen(opened);
    setIndexPartiteSelezionateList([]);
  }, [opened]);
  const { causaList } = useCausaSelect();
  //Submit
  const handleSubmit = () => {
    handleOnSubmit(indexPartiteSelezionateList);
    handleClose();
  };

  const handleTogglePartita = (index) => {
    if (isPartitaSelezionata(index)) {
      setIndexPartiteSelezionateList(
        indexPartiteSelezionateList.filter((x) => x !== index)
      );
    } else
      setIndexPartiteSelezionateList([...indexPartiteSelezionateList, index]);
  };

  const isPartitaSelezionata = (index) => {
    const finded = indexPartiteSelezionateList.find((x) => x === index);
    return finded !== undefined;
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
        <DialogTitle>Elimina</DialogTitle>
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
              disabled={indexPartiteSelezionateList.length === 0}
              variant="contained"
              color="error"
            >
              Elimina
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
