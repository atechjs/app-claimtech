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

  const selezionaTutto = () => {
    setPartiteSelezionate(filtraPartite(dataReclamo.partitaList));
  };

  const deselezionaTutto = () => {
    setPartiteSelezionate([]);
  };

  const filtraPartite = (partitaList) => {
    return partitaList.filter(
      (partita) => partitaList.find((x) => partita.codice === x) === undefined
    );
  };
  return (
    <Paper>
      <Stack direction={"column"} spacing={1} p={1}>
        <Typography>Seleziona le forniture reclamate</Typography>
        <Stack direction={"row"} spacing={1}>
          <Button
            disabled={
              partiteSelezionate.length === dataReclamo.partitaList.length
            }
            variant="outlined"
            onClick={() => selezionaTutto()}
          >
            Seleziona tutto
          </Button>
          <Button
            disabled={partiteSelezionate.length === 0}
            variant="outlined"
            onClick={() => deselezionaTutto()}
          >
            Deseleziona tutto
          </Button>
        </Stack>
        <List sx={{ width: "100%" }}>
          {filtraPartite(dataReclamo.partitaList).map((partita) => {
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
                          Cliente:{" "}
                          <b>
                            {partita.codiceCliente +
                              " - " +
                              partita.descrizioneCliente}
                          </b>{" "}
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
            disabled={partiteSelezionate.length === 0}
          >
            Salva selezione
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}
