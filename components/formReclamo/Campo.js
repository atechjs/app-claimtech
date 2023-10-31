import {
  Button,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
  Box,
  IconButton,
  Chip,
  Tooltip,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useTipoCampoSelect from "../../components/fetching/useTipoCampoSelect";
import useUnitaMisuraSelect from "../../components/fetching/useUnitaMisuraSelect";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import MyReactSelect from "../my-react-select-impl/myReactSelect";
import { mandaNotifica } from "../../utils/ToastUtils";
import DialogDipendenza from "./DialogDipendenza";
import useFormVisualizzazioniSelect from "../fetching/useFormVisualizzazioniSelect";

/*
seconda sezione: lista di componenti campi in cui per ogni campo:
  in alto a sinistra: numerino posizione con due pulsanti freccia
  di fianco label con nome della casella di testo
  dentro: casella di testo con codice, casella di testo con nome, selezione tipo campo,selezione unità di misura,
  divider
  typography dipendenze
  pulsante aggiungi dipendenza,lista dipendenze renderizzata come chip ? quando premo sul chip mi si apre un modal di modifica dipendenza
  il chip ha anche la x per rimuovere 
*/
export default function Campo({
  data,
  onSalvaCampo,
  onDeleteCampo,
  mod = false,
  modificaInAtto = false,
  callbackTrueModificaInAtto,
  campoList,
  nuovo = false,
}) {
  const { visualizzazioniList } = useFormVisualizzazioniSelect();
  const form = useForm({
    defaultValues: {
      id: null,
      codice: null,
      nome: null,
      nomeInglese: null,
      numSequenza: mod ? data.numSequenza : null,
      idTipo: null,
      idUnitaMisura: null,
      idVisualizzazioneList: [],
      associazioneList: [],
    },
  });
  const { register, formState, reset, control, getValues, setValue, watch } =
    form;
  const { errors } = formState;
  const { tipoCampoList } = useTipoCampoSelect();
  const { unitaMisuraList } = useUnitaMisuraSelect();
  const [modifica, setModifica] = useState(mod);
  const [dipendenzaSelezionata, setDipendenzaSelezionata] = useState(null);
  const [associazioneList, setAssociazioneList] = useState(
    data.associazioneList
  );
  const aumentaNumSequenzaDiUno = () => {
    setValue("numSequenza", getValues("numSequenza") + 1);
  };

  const diminuisciNumSequenzaDiUno = () => {
    setValue("numSequenza", getValues("numSequenza") - 1);
  };

  function isBlank(str) {
    return str === null || !str || /^\s*$/.test(str);
  }

  const checkFormNotValido = () => {
    const values = getValues();
    return (
      isBlank(values.codice) ||
      isBlank(values.nome) ||
      isBlank(values.nomeInglese) ||
      values.numSequenza === null ||
      values.idTipo === null ||
      values.idUnitaMisura === null
    );
  };

  const selectStyles = {
    menu: (base) => ({
      ...base,
      zIndex: 100,
    }),
  };

  const onSalvaClick = () => {
    if (checkFormNotValido()) {
      mandaNotifica(
        "Per aggiungere il campo inserisci tutte le informazioni richieste",
        "warning"
      );
      return;
    }
    setModifica(false);
    onSalvaCampo(data.codice, getValues());
  };

  const abilitaModifica = () => {
    reset({
      id: data.id,
      codice: data.codice,
      nome: data.nome,
      nomeInglese: data.nomeInglese,
      numSequenza: data.numSequenza,
      idTipo: data.idTipo,
      idUnitaMisura: data.idUnitaMisura,
      idVisualizzazioneList: data.idVisualizzazioneList,
      associazioneList: data.associazioneList,
    });
    setModifica(true);
    callbackTrueModificaInAtto();
  };

  const textFieldReadOnly = (name, label, value) => {
    return (
      <TextField
        size="small"
        margin="normal"
        id={name}
        label={label}
        defaultValue={value}
        name={name}
        InputProps={{
          readOnly: true,
        }}
      />
    );
  };

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const apriDialogDipendenzaNuovo = () => {
    setDipendenzaSelezionata({
      id: null,
      idDipendente: null,
      codiceDipendente: null,
      expr: " ",
    });
    setOpen(true);
  };

  const apriDialogDipendenzaUpdate = (dipendenza) => {
    setDipendenzaSelezionata(dipendenza);
    setOpen(true);
  };

  const aggiungiDipendenzaOnSubmit = (codiceDipendente, values) => {
    if (codiceDipendente === null) {
      if (
        getValues("associazioneList").find(
          (x) => x.codiceDipendente === values.codiceDipendente
        ) === undefined
      ) {
        setValue("associazioneList", [
          ...getValues("associazioneList"),
          values,
        ]);
        setAssociazioneList([...associazioneList, values]);
      }
    } else {
      //Sto modificando un chip
      const idxSameCodice = getValues("associazioneList").findIndex(
        (x) => x.codiceDipendente === values.codiceDipendente
      );
      //Sostanzialmente qua dovrei modificare idx solo se idxSameCodice è uguale a -1?
      if (idxSameCodice === -1) {
        const nuovo = getValues("associazioneList").filter(
          (x) => x.codiceDipendente !== codiceDipendente
        );
        const finalValue = [...nuovo, values];
        setValue("associazioneList", finalValue);
        setAssociazioneList(finalValue);
      }
    }
    handleClose();
  };

  const rimuoviDipendenza = (codiceDipendente) => {
    setValue(
      "associazioneList",
      getValues("associazioneList").filter(
        (ass) => ass.codiceDipendente !== codiceDipendente
      )
    );
    setAssociazioneList(
      associazioneList.filter(
        (ass) => ass.codiceDipendente !== codiceDipendente
      )
    );
  };
  return (
    <Paper sx={{ m: 2, p: 2 }} key={data.codice}>
      <Stack direction={"column"} spacing={1}>
        <Box
          sx={{
            display: "flex",
            width: "100%",
          }}
        >
          <Stack
            direction={"row"}
            justifyContent="flex-start"
            alignItems="center"
            spacing={1}
            width={"100%"}
          >
            {modifica ? (
              <TextField
                {...register("numSequenza")}
                size="small"
                margin="normal"
                id="numSequenza"
                label="Numero sequenza"
                defaultValue={" "}
                name="numSequenza"
                error={!!errors.numSequenza}
                helperText={errors.numSequenza?.message}
                InputProps={{
                  readOnly: true,
                }}
              />
            ) : (
              <TextField
                size="small"
                margin="normal"
                id="numSequenza"
                label="Numero sequenza"
                defaultValue={data.numSequenza}
                name="numSequenza"
                InputProps={{
                  readOnly: true,
                }}
              />
            )}
            <Stack direction={"column"}>
              <IconButton
                onClick={() => aumentaNumSequenzaDiUno()}
                size="small"
                variant="outlined"
                disabled={!modifica}
              >
                <ArrowDropUpIcon />
              </IconButton>
              <IconButton
                disabled={watch("numSequenza") === 0 || !modifica}
                onClick={() => diminuisciNumSequenzaDiUno()}
                size="small"
              >
                <ArrowDropDownIcon />
              </IconButton>
            </Stack>
            <Typography variant="h5" width={"100%"}>
              {modifica ? watch("nome") : data.nome}
            </Typography>
          </Stack>
          <Stack sx={{ width: "100%" }} direction={"row-reverse"} spacing={1}>
            {modifica ? (
              <Button
                variant="outlined"
                onClick={() => onSalvaClick()}
                size="small"
              >
                Salva
              </Button>
            ) : (
              <Button
                variant="outlined"
                onClick={() => abilitaModifica()}
                disabled={modificaInAtto}
                size="small"
              >
                Modifica
              </Button>
            )}
            <Button
              color="error"
              onClick={() => onDeleteCampo(data)}
              disabled={!nuovo && modifica}
              size="small"
            >
              Elimina
            </Button>
          </Stack>
        </Box>
        <Divider />
        <Typography variant="button">Dati campo</Typography>
        {modifica ? (
          <>
            <TextField
              {...register("codice", {
                required: "Il codice è obbligatorio",
              })}
              size="small"
              margin="normal"
              id="codice"
              label="Codice"
              defaultValue={" "}
              name="codice"
              error={!!errors.codice}
              helperText={errors.codice?.message}
              required
            />
            <TextField
              {...register("nome", {
                required: "Il nome è obbligatorio",
              })}
              size="small"
              margin="normal"
              id="nome"
              label="Nome"
              defaultValue={" "}
              name="nome"
              error={!!errors.nome}
              helperText={errors.nome?.message}
              required
            />
            <TextField
              {...register("nomeInglese", {
                required: "La traduzione è obbligatoria",
              })}
              size="small"
              margin="normal"
              id="nomeInglese"
              label="Traduzione"
              defaultValue={" "}
              name="nomeInglese"
              error={!!errors.nomeInglese}
              helperText={errors.nomeInglese?.message}
              required
            />
            {tipoCampoList ? (
              <MyReactSelect
                control={control}
                name="idTipo"
                label="Tipo campo*"
                options={tipoCampoList}
                menuPosition="fixed"
                styles={selectStyles}
                validation={{
                  required: "Il tipo campo è obbligatorio",
                }}
              />
            ) : null}
            {unitaMisuraList ? (
              <MyReactSelect
                control={control}
                name="idUnitaMisura"
                label="Unità di misura*"
                options={unitaMisuraList}
                styles={selectStyles}
                validation={{
                  required: "l'unità di misura è obbligatoria",
                }}
              />
            ) : null}
            {visualizzazioniList ? (
              <MyReactSelect
                control={control}
                name="idVisualizzazioneList"
                label="Visualizzazioni"
                options={visualizzazioniList}
                isMulti={true}
              />
            ) : (
              <></>
            )}
          </>
        ) : (
          <Stack direction={"column"}>
            {textFieldReadOnly("codice", "Codice", data.codice)}
            {textFieldReadOnly("nome", "Nome", data.nome)}
            {textFieldReadOnly("nomeInglese", "Traduzione", data.nomeInglese)}
            {tipoCampoList ? (
              textFieldReadOnly(
                "tipoCampo",
                "Tipo campo",
                tipoCampoList.find((x) => x.value === data.idTipo).label
              )
            ) : (
              <></>
            )}
            {unitaMisuraList ? (
              textFieldReadOnly(
                "unitaMisura",
                "Unità di misura",
                unitaMisuraList.find((x) => x.value === data.idUnitaMisura)
                  .label
              )
            ) : (
              <></>
            )}
            {visualizzazioniList ? (
              textFieldReadOnly(
                "idVisualizzazioneList",
                "Visualizzazioni",
                ["TUTTI"].concat(
                  data.idVisualizzazioneList.map((optionValue) => {
                    console.log(
                      "getValues",
                      getValues("idVisualizzazioneList")
                    );
                    const finded = visualizzazioniList.find(
                      (option) => option.value === optionValue
                    );
                    if (finded) return finded.label;
                    return "";
                  })
                )
              )
            ) : (
              <></>
            )}
          </Stack>
        )}

        <Typography variant="button">Dipendenze</Typography>
        {modifica ? (
          <Stack direction={"row"} spacing={1}>
            <Button
              onClick={() => apriDialogDipendenzaNuovo()}
              variant="outlined"
            >
              Aggiungi dipendenza
            </Button>
          </Stack>
        ) : (
          <></>
        )}
        <Stack direction={"row"} spacing={1}>
          {associazioneList.map((x) =>
            modifica ? (
              <Tooltip title="Apri">
                <Chip
                  label={x.codiceDipendente}
                  onDelete={() => rimuoviDipendenza(x.codiceDipendente)}
                  onClick={() => apriDialogDipendenzaUpdate(x)}
                />
              </Tooltip>
            ) : (
              <Chip label={x.codiceDipendente} />
            )
          )}
        </Stack>
      </Stack>
      <DialogDipendenza
        opened={open}
        handleClose={handleClose}
        data={dipendenzaSelezionata}
        campoList={campoList
          .filter((x) => x.codice !== data.codice)
          .map((x) => ({ value: x.codice, label: x.nome }))}
        onDialogDipendenzaSubmit={aggiungiDipendenzaOnSubmit}
      />
    </Paper>
  );
}
