import {
  Button,
  Stack,
  Divider,
  Box,
  TextField,
  Paper,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
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
import LabelInformazione from "../reclamo/labelInformazione";
import Select from "react-select";
import useWorkflowGestioneReclamoSelect from "../fetching/useWorkflowGestioneReclamoSelect";
import MyReactSelect from "../my-react-select-impl/myReactSelect";
import GetCurrentAxiosInstance from "../../utils/Axios";
import getApiUrl from "../../utils/BeUrl";
import { mandaNotifica } from "../../utils/ToastUtils";

export default function CreaProposta({ dataList, onSubmit }) {
  const { workflowGestioneReclamoList } = useWorkflowGestioneReclamoSelect();
  const [indexReclamo, setIndexReclamo] = useState(0);
  const [dataReclami, setDataReclami] = useState([]);
  const [dataFornituraCorrente, setDataFornituraCorrente] = useState(
    dataList[0].fornituraCausaReclamoList
  );
  const instance = GetCurrentAxiosInstance();
  const form = useForm({
    defaultValues: {
      note: null,
      idWorkflowApplicaTutti: null,
    },
  });
  const {
    register,
    handleSubmit,
    formState,
    reset,
    control,
    getValues,
    watch,
  } = form;

  const selectStyles = {
    menu: (base) => ({
      ...base,
      zIndex: 100,
    }),
  };

  const datiFornituraCausaReclamoNonCompleti = () => {
    const rigaVuota = dataFornituraCorrente.find(
      (x) => !x.idWorkflowCausaReclamo || x.idWorkflowCausaReclamo === null
    );
    return rigaVuota !== undefined;
  };

  const applicaAtutti = () => {
    setDataFornituraCorrente((old) =>
      old.map((row, rowIndex) => {
        return {
          ...old[rowIndex],
          idWorkflowCausaReclamo: getValues("idWorkflowApplicaTutti"),
        };
      })
    );
  };

  const displayReclamo = (reclamo) => {
    return (
      <Paper>
        <Stack direction={"column"} spacing={2} p={1}>
          <Typography variant="h6">Dati reclamo</Typography>
          <Stack direction={"row"} spacing={2} pl={2} pr={2}>
            <LabelInformazione
              label={"Numero reclamo"}
              value={reclamo.numero}
            />
            <LabelInformazione
              label={"Rif. cliente"}
              value={reclamo.codiceReclamoCliente}
            />
            <LabelInformazione
              label={"Codice cliente"}
              value={reclamo.codiceCliente}
            />
            <LabelInformazione
              label={"Descrizione cliente"}
              value={reclamo.descrizioneCliente}
            />
          </Stack>
          <Divider />
          <Typography variant="h6">Dati proposta</Typography>
          <TextField
            {...register("note")}
            size="small"
            margin="normal"
            id="note"
            label="Note proposta"
            name="note"
            multiline
            minRows={4}
          />
          <Stack direction={"column"} spacing={1}>
            <Stack direction={"row"} spacing={1}>
              <Box minWidth={200}>
                {workflowGestioneReclamoList ? (
                  <MyReactSelect
                    control={control}
                    name="idWorkflowApplicaTutti"
                    label={null}
                    options={workflowGestioneReclamoList}
                    styles={selectStyles}
                    autoSize={true}
                  />
                ) : null}
              </Box>
              <Button variant="contained" onClick={() => applicaAtutti()}>
                Applica a tutti
              </Button>
            </Stack>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Codice fornitura</TableCell>
                    <TableCell>Codice causa</TableCell>
                    <TableCell>Articolo</TableCell>
                    <TableCell>Linea</TableCell>
                    <TableCell>Proposta</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dataFornituraCorrente.map((fornituraCausaReclamo, index) => {
                    return (
                      <TableRow>
                        <TableCell>
                          {fornituraCausaReclamo.codiceFornitura}
                        </TableCell>
                        <TableCell>
                          {fornituraCausaReclamo.codiceCausa}
                        </TableCell>
                        <TableCell>
                          {fornituraCausaReclamo.codiceArticolo}
                        </TableCell>
                        <TableCell>
                          {fornituraCausaReclamo.codiceLinea}
                        </TableCell>
                        <TableCell>
                          {workflowGestioneReclamoList ? (
                            <Select
                              options={workflowGestioneReclamoList}
                              onChange={(e) => {
                                const newValue =
                                  !e || e == null ? null : e.value;
                                setDataFornituraCorrente((old) =>
                                  old.map((row, rowIndex) => {
                                    if (rowIndex === index) {
                                      return {
                                        ...old[rowIndex],
                                        idWorkflowCausaReclamo: newValue,
                                      };
                                    }
                                    return row;
                                  })
                                );
                              }}
                              autosize={true}
                              value={workflowGestioneReclamoList.find(
                                (x) =>
                                  x.value ===
                                  fornituraCausaReclamo.idWorkflowCausaReclamo
                              )}
                              menuPosition="fixed"
                              styles={selectStyles}
                            />
                          ) : null}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Stack>
        </Stack>
      </Paper>
    );
  };

  const formattaDatiCorrenti = () => {
    //Ottengo i valori
    const values = getValues();
    const obj = {
      ...dataList[indexReclamo],
      ...values,
      fornituraCausaReclamoList: dataFornituraCorrente,
    };
    //Se esiste la posizione corrente la aggiorno, altrimenti la creo
    let out = dataReclami;
    if (dataReclami[indexReclamo] !== null) out[indexReclamo] = obj;
    else out = [...out, obj];
    setDataReclami(out);
    return out;
  };

  const avantiOSalva = () => {
    const currentList = formattaDatiCorrenti();
    //Vado al prossimo reclamo oppure salvo
    const idx = indexReclamo + 1;
    if (idx === dataList.length) salva(currentList);
    else prossimo(idx);
  };

  const salva = (currentList) => {
    instance
      .post(getApiUrl() + "api/reclamo/nuovaProposta", currentList)
      .then((response) => {
        mandaNotifica("Proposta creata con successo", "success");
        onSubmit();
      })
      .catch((error) => {
        mandaNotifica("Impossibile creare la proposta", "error");
      });
  };

  const prossimo = (idx) => {
    let dataFornitura;
    let note;
    const idWorkflowApplicaTutti = null;
    if (dataReclami[idx]) {
      dataFornitura = dataReclami[idx].fornituraCausaReclamoList;
      note = dataReclami[idx].note;
    } else {
      dataFornitura = dataList[idx].fornituraCausaReclamoList;
      note = null;
    }
    setDataFornituraCorrente(dataFornitura);
    reset({ note, idWorkflowApplicaTutti });
  };

  return (
    <Stack direction={"column"} spacing={1}>
      {displayReclamo(dataList[indexReclamo])}
      <Stack
        direction={"row-reverse"}
        spacing={1}
        pl={2}
        pr={2}
        onClick={() => avantiOSalva()}
      >
        <Button
          variant="contained"
          color="primary"
          disabled={datiFornituraCausaReclamoNonCompleti()}
        >
          {indexReclamo === dataList.length - 1
            ? "Salva" + " (" + (indexReclamo + 1) + "/" + dataList.length + ")"
            : "Prossimo" +
              " (" +
              indexReclamo +
              1 +
              "/" +
              dataList.length +
              ")"}
        </Button>
        <Button color="primary" disabled={indexReclamo === 0}>
          Indietro
        </Button>
      </Stack>
    </Stack>
  );
}
