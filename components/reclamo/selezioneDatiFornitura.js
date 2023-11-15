import { Button, Paper, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import Alert from "@mui/material/Alert";

export default function SelezioneDatiFornitura({
  dataReclamo,
  onDatiFornituraSelezionati,
  partitaList = [],
}) {
  const [partiteSelezionate, setPartiteSelezionate] = useState([]);

  const handleToggle = (partitaInput) => {
    if (isSelected(partitaInput)) {
      const nuovo = partiteSelezionate.filter(
        (x) => x.codice !== partitaInput.codice
      );
      setPartiteSelezionate(nuovo);
    } else setPartiteSelezionate([...partiteSelezionate, partitaInput]);
  };

  const isSelected = (partitaInput) => {
    const find = partiteSelezionate.find(
      (partita) => partita.codice === partitaInput.codice
    );
    return find !== undefined;
  };
  return (
    <Paper>
      <Stack direction={"column"} spacing={1} p={1}>
        <Typography>Seleziona le forniture reclamate</Typography>
        <List sx={{ width: "100%" }}>
          {dataReclamo.partitaList
            .filter(
              (partita) =>
                partitaList.find((x) => partita.codice === x) === undefined
            )
            .map((partita) => {
              return (
                <ListItem key={partita.codice} disablePadding>
                  <ListItemButton onClick={() => handleToggle(partita)} dense>
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={isSelected(partita)}
                        tabIndex={-1}
                        disableRipple
                      />
                    </ListItemIcon>
                    <ListItemText
                      id={partita.codice}
                      primary={partita.codice}
                      secondary={
                        <>
                          <Typography>
                            Codice articolo: <b>{partita.codiceArticolo}</b>{" "}
                            Linea: <b>{partita.codiceLinea}</b>
                          </Typography>

                          {partita.numReclamoGiaReclamata !== null ? (
                            <Alert severity="warning">
                              Già reclamata in #{partita.numReclamoGiaReclamata}
                            </Alert>
                          ) : (
                            <></>
                          )}
                        </>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
        </List>
        <Stack direction={"row"}>
          <Button
            variant="contained"
            onClick={() => onDatiFornituraSelezionati(partiteSelezionate)}
          >
            Salva selezione
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}
