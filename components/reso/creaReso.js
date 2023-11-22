import { Button, Stack, TextField } from "@mui/material";
import React, { useState } from "react";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import { Controller, useForm } from "react-hook-form";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export default function CreaReso({ dataList, onSubmit }) {
  const getColonnaDataFromDataList = (dataList) => {
    if (!dataList) return;
    const reclamo = dataList[0];
    const fornitura = reclamo.fornituraList[0];
    const fornituraCausaReclamo = fornitura.fornituraCausaReclamoList[0];
    const campoList = fornituraCausaReclamo.campoList;
    return campoList;
  };
  const TAG_RESO = "_reso";
  const mapDataList = (dataList) => {
    const colonnaData = getColonnaDataFromDataList(dataList);
    let outList = [];
    dataList.forEach((reclamo) => {
      reclamo.fornituraList.forEach((fornitura) => {
        fornitura.fornituraCausaReclamoList.forEach((fornituraCausaReclamo) => {
          let mappedObj = {
            id: fornituraCausaReclamo.id,
            idReclamo: reclamo.id,
            numero: reclamo.numero,
            codiceReclamoCliente: reclamo.codiceReclamoCliente,
            codiceFornitura: fornitura.codice,
            codicePartitaCliente: fornitura.codicePartitaCliente,
            descrizioneCliente: reclamo.descrizioneCliente,
            codiceArticolo: fornitura.codiceArticolo,
            codiceCausa: fornituraCausaReclamo.codiceCausa,
            selezionato: true,
          };
          colonnaData.forEach(
            (campo) =>
              (mappedObj = {
                ...mappedObj,
                [campo.codice]: fornituraCausaReclamo.campoList.find(
                  (y) => y.codice === campo.codice
                ).value,
                [campo.codice + TAG_RESO]: campo.rendi,
              })
          );
          outList = [...outList, mappedObj];
        });
      });
    });
    outList.sort((a, b) => a.codiceFornitura > b.codiceFornitura);
    return outList;
  };
  const [data, setData] = useState(mapDataList(dataList));
  const [step, setStep] = useState(0);
  const steps = ["Selezione forniture", "Inserimento dati reso"];

  const form = useForm({
    defaultValues: {
      codice: "",
      data: dayjs(),
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

  const getDataSelezionata = () => {
    return data.filter((x) => x.selezionato);
  };
  const selezionaODeseleziona = () => {
    setData(
      data.map((obj) => ({
        ...obj,
        selezionato: getDataSelezionata().length === 0 ? true : false,
      }))
    );
  };
  const confermaSelezione = () => {
    reset({ codice: "", data: dayjs() });
    setStep(1);
  };

  const handleToggle = (item) => {
    setData(
      data.map((d) =>
        d.id === item.id ? { ...d, selezionato: !d.selezionato } : d
      )
    );
  };

  const setValueCampoReso = (item, campo, value) => {
    setData(
      data.map((d) =>
        d.id === item.id ? { ...d, [campo + TAG_RESO]: value } : d
      )
    );
  };

  const setValueCampo = (item, campo, value) => {
    setData(data.map((d) => (d.id === item.id ? { ...d, [campo]: value } : d)));
  };

  const tornaIndietro = () => {
    setStep(0);
  };

  const mapToResult = (list) => {
    const columnData = getColonnaDataFromDataList(dataList);
    let outList = [];
    list.forEach((d) => {
      let finalObj = {};
      let campoList = [];
      Object.keys(d).forEach((key) => {
        if (columnData.find((x) => x.codice === key))
          campoList = [
            ...campoList,
            { codice: key, value: d[key], reso: d[key + TAG_RESO] },
          ];
        else finalObj = { ...finalObj, [key]: d[key] };
      });
      finalObj = { ...finalObj, campoList };
      outList = [...outList, finalObj];
    });
    return outList;
  };

  const onFormSubmit = (values) => {
    onSubmit({
      ...values,
      data: dayjs(values.data).format("DD/MM/YYYY"),
      fornituraCausaReclamoList: mapToResult(data.filter((x) => x.selezionato)),
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
        <>
          <Stack direction={"row"} spacing={1}>
            <Button variant="outlined" onClick={() => selezionaODeseleziona()}>
              {getDataSelezionata().length === 0
                ? "Seleziona tutto"
                : "Deseleziona tutto"}
            </Button>
            <Button
              variant="contained"
              onClick={() => confermaSelezione()}
              disabled={getDataSelezionata().length === 0}
            >
              Conferma selezione
            </Button>
          </Stack>
          <TableContainer>
            <Table size={"small"}>
              <TableHead>
                <TableRow>
                  <TableCell>Selezionato</TableCell>
                  <TableCell>Numero reclamo</TableCell>
                  <TableCell>Codice reclamo cliente</TableCell>
                  <TableCell>Codice fornitura</TableCell>
                  <TableCell>Codice partita cliente</TableCell>
                  <TableCell>Descrizione cliente</TableCell>
                  <TableCell>Codice articolo</TableCell>
                  <TableCell>Causa</TableCell>
                  {getColonnaDataFromDataList(dataList).map((x) => {
                    return (
                      <>
                        {x.rendi ? <TableCell>Reso</TableCell> : "-"}
                        <TableCell>{x.nome}</TableCell>
                      </>
                    );
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {data
                  .sort(function (a, b) {
                    return ("" + a.codiceFornitura).localeCompare(
                      b.codiceFornitura
                    );
                  })
                  .map((x) => {
                    const columnData = getColonnaDataFromDataList(dataList);

                    return (
                      <TableRow>
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            checked={x.selezionato}
                            onClick={() => handleToggle(x)}
                          />
                        </TableCell>
                        <TableCell>{x.numero}</TableCell>
                        <TableCell>{x.codiceReclamoCliente}</TableCell>
                        <TableCell>{x.codiceFornitura}</TableCell>
                        <TableCell>{x.codicePartitaCliente}</TableCell>
                        <TableCell>{x.descrizioneCliente}</TableCell>
                        <TableCell>{x.codiceArticolo}</TableCell>
                        <TableCell>{x.codiceCausa}</TableCell>
                        {columnData.map((column) => {
                          return (
                            <>
                              {column.rendi ? (
                                <TableCell padding="checkbox">
                                  <Checkbox
                                    color="primary"
                                    checked={x[column.codice + TAG_RESO]}
                                    onChange={(e) =>
                                      setValueCampoReso(
                                        x,
                                        column.codice,
                                        e.target.checked
                                      )
                                    }
                                  />
                                </TableCell>
                              ) : (
                                "-"
                              )}
                              <TableCell>
                                <TextField
                                  label="VALORE"
                                  fullWidth
                                  variant="outlined"
                                  type="number"
                                  value={x[column.codice]}
                                  onChange={(e) =>
                                    setValueCampo(
                                      x,
                                      column.codice,
                                      e.target.value
                                    )
                                  }
                                  autoComplete="off"
                                />
                              </TableCell>
                            </>
                          );
                        })}
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      ) : (
        <Stack
          direction={"column"}
          component="form"
          noValidate
          onSubmit={handleSubmit(onFormSubmit)}
        >
          <Stack direction={"row"} spacing={1}>
            <Button variant="outlined" onClick={() => tornaIndietro()}>
              Torna indietro
            </Button>
            <Button variant="contained" type="submit">
              Crea reso
            </Button>
          </Stack>
          <TextField
            {...register("codice", {
              required: "Il codice è obbligatorio",
            })}
            size="small"
            margin="normal"
            id="codice"
            label="Codice documento"
            name="codice"
            error={!!errors.codice}
            helperText={errors.codice?.message}
            autoFocus
          />
          <Controller
            name="data"
            control={control}
            defaultValue={dayjs()}
            rules={{ required: "La data è obbligatoria" }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <DatePicker
                label="Data creazione*"
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
        </Stack>
      )}
    </Stack>
  );
}
