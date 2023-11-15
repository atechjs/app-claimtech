import React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import useAllUtenti from "../fetching/useAllUtenti";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TabDialogCondivisioneUtenti from "./TabDialogCondivisioneUtenti";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import useAllGruppiUtenteConUtenti from "../fetching/useAllGruppiUtenteConUtenti";
import ShareIcon from "@mui/icons-material/Share";
import { Stack } from "@mui/material";
export default function CondivisioneUtente({ onSubmit, onBack }) {
  const [tab, setTab] = React.useState(0);
  const {
    utenteList,
    isLoading: utenteLoading,
    isError: utenteError,
  } = useAllUtenti();
  const {
    gruppoUtenteList,
    isLoading: gruppoUtenteLoading,
    isError: gruppoUtenteError,
  } = useAllGruppiUtenteConUtenti();

  const [utentiSelezionati, setUtentiSelezionati] = React.useState([]);
  const [gruppiSelezionati, setGruppiSelezionati] = React.useState([]);

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  const isSelected = (utenteInput) => {
    const find = utentiSelezionati.find(
      (utente) => utente.id === utenteInput.id
    );
    return find !== undefined;
  };

  const isGruppoSelezionato = (gruppoInput) => {
    const find = gruppiSelezionati.find(
      (gruppo) => gruppo.id === gruppoInput.id
    );
    return find !== undefined;
  };

  const handleToggleGruppo = (gruppo) => {
    if (isGruppoSelezionato(gruppo)) {
      const nuovoG = gruppiSelezionati.filter((x) => x.id !== gruppo.id);
      setGruppiSelezionati(nuovoG);
      const nuovoGUtenti = utentiSelezionati.filter(
        (x) =>
          gruppo.utenteList.find((utente) => utente.id === x.id) === undefined
      );
      setUtentiSelezionati(nuovoGUtenti);
    } else {
      setGruppiSelezionati([...gruppiSelezionati, gruppo]);
      let nuovi = [];
      gruppo.utenteList
        .filter(
          (x) => utentiSelezionati.find((y) => x.id === y.id) === undefined
        )
        .forEach((element) => {
          nuovi = [...nuovi, element];
        });
      const nuovoGUtenti = utentiSelezionati.concat(nuovi);
      setUtentiSelezionati(nuovoGUtenti);
    }
  };

  const handleToggleUtente = (utente) => {
    if (isSelected(utente)) {
      const nuovoG = utentiSelezionati.filter((x) => x.id !== utente.id);
      setUtentiSelezionati(nuovoG);
    } else {
      setUtentiSelezionati([...utentiSelezionati, utente]);
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tab}
          onChange={handleChange}
          aria-label="tab condivisione utenti"
        >
          <Tab label="Gruppi" />
          <Tab label="Utenti" />
        </Tabs>
      </Box>
      {gruppoUtenteList !== undefined ? (
        <TabDialogCondivisioneUtenti value={tab} index={0}>
          <List sx={{ width: "100%", bgcolor: "background.paper" }}>
            {gruppoUtenteList.map((gruppo) => {
              return (
                <ListItem key={gruppo.id} disablePadding>
                  <ListItemButton
                    onClick={() => handleToggleGruppo(gruppo)}
                    dense
                  >
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={isGruppoSelezionato(gruppo)}
                        tabIndex={-1}
                        disableRipple
                      />
                    </ListItemIcon>
                    <ListItemText id={gruppo.id} primary={gruppo.codice} />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </TabDialogCondivisioneUtenti>
      ) : (
        <></>
      )}
      {utenteList !== undefined ? (
        <TabDialogCondivisioneUtenti value={tab} index={1}>
          <List sx={{ width: "100%", bgcolor: "background.paper" }}>
            {utenteList.map((utente) => {
              return (
                <ListItem key={utente.id} disablePadding>
                  <ListItemButton
                    onClick={() => handleToggleUtente(utente)}
                    dense
                  >
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={isSelected(utente)}
                        tabIndex={-1}
                        disableRipple
                      />
                    </ListItemIcon>
                    <ListItemText
                      id={utente.id}
                      primary={utente.nome + " " + utente.cognome}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </TabDialogCondivisioneUtenti>
      ) : (
        <></>
      )}
      <Stack
        direction="row-reverse"
        justifyContent="flex-start"
        alignItems="center"
        spacing={2}
        p={2}
      >
        <Button
          variant="contained"
          onClick={() => onSubmit(utentiSelezionati)}
          endIcon={<ShareIcon />}
          disabled={utentiSelezionati.length === 0}
        >
          Condividi
        </Button>
        <Button variant="text" onClick={() => onBack()}>
          Annulla
        </Button>
      </Stack>
    </Box>
  );
}
