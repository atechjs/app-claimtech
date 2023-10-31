import {
  Button,
  Divider,
  List,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { Controller, useForm } from "react-hook-form";
import getConverterApiKey from "../../utils/converterApi";
import { mandaNotifica } from "../../utils/ToastUtils";
import axios from "axios";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export default function CreaNotaAccreditoMenu({ dataList, onSubmit }) {
  const getAll = (list) => {
    let fArr = [];
    list.forEach((r) =>
      r.fornituraList.forEach((f) =>
        f.fornituraCausaReclamoList.forEach((fcr) => (fArr = [...fArr, fcr]))
      )
    );
    return fArr;
  };
  const [
    fornituraCausaReclamoSelezionata,
    setFornituraCausaReclamoSelezionata,
  ] = useState(getAll(dataList));
  const [step, setStep] = useState(0);

  const steps = ["Selezione forniture", "Inserimento dati nota accredito"];

  const form = useForm({
    defaultValues: {
      codice: "",
      tipo: "",
      anno: "",
      numero: "",
      data: dayjs(),
      valoreValuta: "",
      valoreEuro: " ",
    },
  });
  const {
    register,
    handleSubmit,
    formState,
    reset,
    control,
    getValues,
    setValue,
    watch,
  } = form;
  const { errors } = formState;

  const getTotaleSelezionato = (dataList) => {
    let sum = 0;
    dataList.forEach((f) => (sum = sum + f.valoreContestazione));
    return approssima(sum);
  };

  const getTotaleReclamo = (reclamo) => {
    let sum = 0;
    reclamo.fornituraList.forEach((f) =>
      f.fornituraCausaReclamoList.forEach(
        (fcr) => (sum = sum + fcr.valoreContestazione)
      )
    );
    return approssima(sum);
  };

  const handleToggle = (fornituraCausaReclamo) => {
    if (isSelected(fornituraCausaReclamo)) {
      setFornituraCausaReclamoSelezionata(
        fornituraCausaReclamoSelezionata.filter(
          (x) => x.id !== fornituraCausaReclamo.id
        )
      );
    } else
      setFornituraCausaReclamoSelezionata([
        ...fornituraCausaReclamoSelezionata,
        fornituraCausaReclamo,
      ]);
  };

  const isSelected = (fornituraCausaReclamo) => {
    return fornituraCausaReclamoSelezionata.find(
      (x) => x.id === fornituraCausaReclamo.id
    );
  };

  const selezionaODeseleziona = () => {
    if (fornituraCausaReclamoSelezionata.length === 0)
      setFornituraCausaReclamoSelezionata(getAll(dataList));
    else setFornituraCausaReclamoSelezionata([]);
  };

  const confermaSelezione = () => {
    const valore = getTotaleSelezionato(fornituraCausaReclamoSelezionata);
    reset({ valoreValuta: valore });
    convertiInEuro(valore);
    setStep(1);
  };

  const tornaIndietro = () => {
    setStep(0);
  };

  const onFormSubmit = (data) => {
    onSubmit({
      idFornituraCausaReclamoList: fornituraCausaReclamoSelezionata,
      ...data,
      data: dayjs(data.data).format("DD/MM/YYYY"),
    });
  };

  function isNumeric(str) {
    return (
      !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
      !isNaN(parseFloat(str))
    ); // ...and ensure strings of whitespace fail
  }

  const approssima = (num) => {
    if (Array.isArray(num)) return num;
    if (!isNumeric(num)) return num;
    const approssimato = roundToTwo(num);
    return approssimato;
  };

  function roundToTwo(num) {
    return +(Math.round(num + "e+2") + "e-2");
  }

  const getCodiceValuta = () => {
    if (!dataList || dataList.length === 0) return "ND";
    return dataList[0].codiceValuta;
  };

  const convertiInEuro = (totale) => {
    //TODO Conversione
    if (getCodiceValuta() === "EUR") {
      setValue("valoreEuro", totale);
      return;
    }
    axios
      .get(
        "https://api.currencybeacon.com/v1/convert?from=" +
          getCodiceValuta() +
          "&to=EUR&amount=" +
          totale +
          "&api_key=" +
          getConverterApiKey()
      )
      .then((response) => {
        setValue("valoreEuro", approssima(response.data.response.value));
      });
  };

  return (
    <Stack direction={"column"} spacing={1}>
      <Stepper activeStep={step}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {step === 0 ? (
        <Stack direction={"column"} spacing={1}>
          <Stack direction={"row"} spacing={1}>
            <Button variant="outlined" onClick={() => selezionaODeseleziona()}>
              {fornituraCausaReclamoSelezionata.length === 0
                ? "Seleziona tutto"
                : "Deseleziona tutto"}
            </Button>
            <Button
              variant="contained"
              onClick={() => confermaSelezione()}
              disabled={fornituraCausaReclamoSelezionata.length === 0}
            >
              Conferma selezione
            </Button>
          </Stack>
          <Typography>
            Totale selezionato:{" "}
            <b>
              {getTotaleSelezionato(fornituraCausaReclamoSelezionata) +
                " " +
                getCodiceValuta()}
            </b>
          </Typography>
          {dataList.map((reclamo) => (
            <Accordion defaultExpanded>
              <AccordionSummary>
                <Stack direction={"row"} spacing={1} divider={<Divider />}>
                  <Typography>
                    Reclamo #<b>{reclamo.numero}</b>
                  </Typography>
                  <Typography>
                    Cliente <b>{reclamo.descrizioneCliente}</b>
                  </Typography>
                  <Typography>
                    TOTALE:{" "}
                    <b>{getTotaleReclamo(reclamo) + " " + getCodiceValuta()}</b>
                  </Typography>
                </Stack>
              </AccordionSummary>
              <AccordionDetails>
                <Stack direction={"column"} spacing={0.5}>
                  <Divider />
                  {reclamo.fornituraList.map((fornitura) => {
                    return (
                      <>
                        <Stack direction={"row"} spacing={1}>
                          <Typography variant="button">
                            Partita: <b>{fornitura.codice}</b>
                          </Typography>
                          <Typography variant="button">
                            Codice partita cliente:{" "}
                            <b>{fornitura.codicePartitaCliente}</b>
                          </Typography>
                        </Stack>
                        <Typography variant="button">
                          Codice articolo: <b>{fornitura.codiceArticolo}</b>
                        </Typography>
                        <List>
                          {fornitura.fornituraCausaReclamoList.map(
                            (fornituraCausaReclamo) => (
                              <ListItem
                                key={fornituraCausaReclamo.id}
                                disablePadding
                              >
                                <ListItemButton
                                  onClick={() =>
                                    handleToggle(fornituraCausaReclamo)
                                  }
                                  dense
                                >
                                  <ListItemIcon>
                                    <Checkbox
                                      edge="start"
                                      checked={isSelected(
                                        fornituraCausaReclamo
                                      )}
                                      tabIndex={-1}
                                      disableRipple
                                    />
                                  </ListItemIcon>
                                  <ListItemText
                                    id={fornituraCausaReclamo.id}
                                    primary={fornituraCausaReclamo.codiceCausa}
                                    secondary={
                                      <Stack direction={"column"}>
                                        <Stack direction={"row"} spacing={1}>
                                          {fornituraCausaReclamo.campoList.map(
                                            (campo) => (
                                              <Stack direction={"row"}>
                                                <Typography variant="button">
                                                  {campo.nome}:{" "}
                                                  <b>
                                                    {campo.value}{" "}
                                                    {campo.codiceUnitaMisura}
                                                  </b>
                                                </Typography>
                                              </Stack>
                                            )
                                          )}
                                        </Stack>
                                        <Typography variant="button">
                                          Valore contestazione:{" "}
                                          <b>
                                            {
                                              fornituraCausaReclamo.valoreContestazione
                                            }{" "}
                                            {getCodiceValuta()}
                                          </b>
                                        </Typography>
                                      </Stack>
                                    }
                                  />
                                </ListItemButton>
                              </ListItem>
                            )
                          )}
                        </List>
                      </>
                    );
                  })}
                </Stack>
              </AccordionDetails>
            </Accordion>
          ))}
        </Stack>
      ) : step === 1 ? (
        <Stack
          direction={"column"}
          spacing={2}
          component="form"
          noValidate
          onSubmit={handleSubmit(onFormSubmit)}
        >
          <Stack direction={"row"} spacing={1}>
            <Button variant="outlined" onClick={() => tornaIndietro()}>
              Torna indietro
            </Button>
            <Button variant="contained" type="submit">
              Crea nota accredito
            </Button>
          </Stack>
          <Typography>Dati nota accredito</Typography>
          <Stack direction={"row"} spacing={2}>
            <TextField
              {...register("codice", {
                required: "Il codice è obbligatorio",
              })}
              size="small"
              margin="normal"
              required
              id="codice"
              label="Codice nota accredito"
              name="codice"
              error={!!errors.codice}
              fullWidth
              helperText={errors.codice?.message}
              onChange={(event) => {
                const value = event.target.value;
                let tipo = "";
                let anno = "";
                let numero = "";
                //CN020230000214
                if (value.length > 13) {
                  tipo = value.substring(0, 3);
                  anno = value.substring(3, 7);
                  numero = Number(value.substring(7));
                }
                setValue("codice", value);
                setValue("tipo", tipo);
                setValue("anno", anno);
                setValue("numero", numero);
              }}
              autoFocus
              autoComplete="off"
            />
            <TextField
              {...register("tipo")}
              size="small"
              margin="normal"
              id="tipo"
              label="Tipo"
              name="tipo"
              error={!!errors.tipo}
              helperText={errors.tipo?.message}
              InputProps={{
                readOnly: true,
              }}
              value={watch("tipo") || ""}
            />
            <TextField
              {...register("anno")}
              size="small"
              margin="normal"
              id="anno"
              label="Anno"
              name="anno"
              error={!!errors.anno}
              helperText={errors.anno?.message}
              InputProps={{
                readOnly: true,
              }}
              value={watch("anno") || ""}
            />
            <TextField
              {...register("numero")}
              size="small"
              margin="normal"
              id="numero"
              label="Numero"
              name="numero"
              error={!!errors.numero}
              helperText={errors.numero?.message}
              InputProps={{
                readOnly: true,
              }}
              value={watch("numero") || ""}
            />
          </Stack>
          <Controller
            name="data"
            control={control}
            defaultValue={dayjs()}
            rules={{ required: "La data è obbligatoria" }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <DatePicker
                label="Data*"
                format="DD/MM/YYYY"
                value={value}
                control={control}
                onChange={(event) => onChange(event)}
                slotProps={{
                  textField: { error: !!error, helperText: error?.message },
                }}
              />
            )}
          />
          <Stack direction={"row"} spacing={1}>
            <TextField
              {...register("valoreValuta", {
                required: "Il valore è obbligatorio",
              })}
              size="small"
              margin="normal"
              id="valoreValuta"
              label={"Valore nota accredito (" + getCodiceValuta() + ")"}
              name="valoreValuta"
              type="number"
              onChange={(event) => {
                const value = event.target.value;
                convertiInEuro(value);
              }}
              error={!!errors.valoreValuta}
              helperText={errors.valoreValuta?.message}
              required
              autoComplete="off"
            />
            <TextField
              {...register("valoreEuro", {
                required: "Il valore è obbligatorio",
              })}
              size="small"
              margin="normal"
              id="valoreEuro"
              label={"Valore nota accredito EURO"}
              name="valoreEuro"
              type="number"
              value={watch("valoreEuro") || ""}
              error={!!errors.valoreEuro}
              helperText={errors.valoreEuro?.message}
              required
              autoComplete="off"
            />
          </Stack>
        </Stack>
      ) : (
        <></>
      )}
    </Stack>
  );
}
