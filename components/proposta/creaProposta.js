import {
  Button,
  Stack,
  Box,
  TextField,
  Paper,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useForm } from "react-hook-form";
import Select from "react-select";
import useWorkflowGestioneReclamoSelect from "../fetching/useWorkflowGestioneReclamoSelect";
import MyReactSelect from "../my-react-select-impl/myReactSelect";
import GetCurrentAxiosInstance from "../../utils/Axios";
import getApiUrl from "../../utils/BeUrl";
import { mandaNotifica } from "../../utils/ToastUtils";

export default function CreaProposta({ dataList, onSubmit }) {
  const { workflowGestioneReclamoList } = useWorkflowGestioneReclamoSelect();
  const [indexReclamo, setIndexReclamo] = useState(0);
  const [dataReclami, setDataReclami] = useState(dataList);
  const instance = GetCurrentAxiosInstance();
  const form = useForm({
    defaultValues: {
      note: null,
      idWorkflowApplicaTutti: null,
    },
  });
  const { register, control, getValues } = form;

  const selectStyles = {
    menu: (base) => ({
      ...base,
      zIndex: 100,
    }),
  };

  const datiFornituraCausaReclamoNonCompleti = () => {
    return (
      dataReclami.find(
        (reclamo) =>
          reclamo.fornituraCausaReclamoList.find(
            (x) =>
              !x.idWorkflowCausaReclamo || x.idWorkflowCausaReclamo === null
          ) !== undefined
      ) !== undefined
    );
  };

  const applicaAtutti = () => {
    setDataReclami((oldList) =>
      oldList.map((riga) => ({
        ...riga,
        fornituraCausaReclamoList: riga.fornituraCausaReclamoList.map((row) => {
          return {
            ...row,
            idWorkflowCausaReclamo: getValues("idWorkflowApplicaTutti"),
          };
        }),
      }))
    );
  };

  const displayReclamo = () => {
    return (
      <Paper>
        <Stack direction={"column"} spacing={2} p={1}>
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
                    <TableCell>Numero reclamo</TableCell>
                    <TableCell>Cliente</TableCell>
                    <TableCell>Codice fornitura</TableCell>
                    <TableCell>Codice causa</TableCell>
                    <TableCell>Articolo</TableCell>
                    <TableCell>Linea</TableCell>
                    <TableCell>Proposta</TableCell>
                    <TableCell>Note</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dataReclami
                    .sort((a, b) => a.numero - b.numero)
                    .reverse()
                    .flatMap((x) =>
                      x.fornituraCausaReclamoList.map(
                        (fornituraCausaReclamo, index) => {
                          return (
                            <TableRow>
                              <TableCell>{x.numero}</TableCell>
                              <TableCell>{x.descrizioneCliente}</TableCell>
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
                                      setDataReclami((old) =>
                                        old.map((x) => ({
                                          ...x,
                                          fornituraCausaReclamoList:
                                            x.fornituraCausaReclamoList.map(
                                              (y) => {
                                                if (
                                                  y.id ===
                                                  fornituraCausaReclamo.id
                                                )
                                                  return {
                                                    ...y,
                                                    idWorkflowCausaReclamo:
                                                      newValue,
                                                  };
                                                else return y;
                                              }
                                            ),
                                        }))
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
                              <TableCell>
                                <TextField
                                  id="notePropostaFornituraCausaReclamo"
                                  sx={{ minWidth: 200 }}
                                  label=""
                                  multiline
                                  maxRows={4}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    setDataReclami((old) =>
                                      old.map((x) => ({
                                        ...x,
                                        fornituraCausaReclamoList:
                                          x.fornituraCausaReclamoList.map(
                                            (y) => {
                                              if (
                                                y.id ===
                                                fornituraCausaReclamo.id
                                              )
                                                return {
                                                  ...y,
                                                  note: value,
                                                };
                                              else return y;
                                            }
                                          ),
                                      }))
                                    );
                                  }}
                                  value={fornituraCausaReclamo.note}
                                />
                              </TableCell>
                            </TableRow>
                          );
                        }
                      )
                    )}
                </TableBody>
              </Table>
            </TableContainer>
          </Stack>
        </Stack>
      </Paper>
    );
  };

  const salva = () => {
    instance
      .post(
        getApiUrl() + "api/reclamo/nuovaProposta",
        dataReclami.map((data) => ({ ...data, note: getValues("note") }))
      )
      .then((response) => {
        mandaNotifica("Proposta creata con successo", "success");
        onSubmit();
      })
      .catch((error) => {
        console.error(error);
        mandaNotifica("Impossibile creare la proposta", "error");
      });
  };

  return (
    <Stack direction={"column"} spacing={1}>
      {displayReclamo()}
      <Stack direction={"row-reverse"} spacing={1} pl={2} pr={2}>
        <Button
          variant="contained"
          color="primary"
          disabled={datiFornituraCausaReclamoNonCompleti()}
          onClick={() => salva()}
        >
          Salva
        </Button>
      </Stack>
    </Stack>
  );
}
