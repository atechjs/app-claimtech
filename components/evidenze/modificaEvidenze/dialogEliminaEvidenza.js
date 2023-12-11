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

export default function DialogEliminaEvidenza({
  opened,
  handleClose,
  handleOnSubmit,
  dataList,
}) {
  const [open, setOpen] = React.useState(opened);
  const [indexPartiteSelezionateList, setIndexPartiteSelezionateList] =
    useState([]);
  React.useEffect(() => {
    setOpen(opened);
    setIndexPartiteSelezionateList([]);
  }, [opened]);
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
  return (
    <Dialog open={open} onClose={handleClose}>
      <Stack direction={"column"} p={2}>
        <DialogTitle>Elimina</DialogTitle>
        <Box>
          <List sx={{ width: "100%" }}>
            {dataList.map((evidenza, index) => {
              return (
                <ListItem key={evidenza.codiceFornitura} disablePadding>
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
                      id={evidenza.codiceFornitura}
                      primary={evidenza.codiceFornitura}
                      secondary={
                        <>
                          <Typography variant="button">Causa: </Typography>
                          <b>{evidenza.codiceCausaReclamo}</b>
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
