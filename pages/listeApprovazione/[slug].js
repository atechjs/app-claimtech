import React, { useEffect, useState } from "react";
import NestedLayout from "../../components/nestedLayout";
import Layout from "../../components/layout";
import {
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import GetCurrentAxiosInstance from "../../utils/Axios";
import getApiUrl from "../../utils/BeUrl";
import { mandaNotifica } from "../../utils/ToastUtils";
import MyReactSelect from "../../components/my-react-select-impl/myReactSelect";
import { styled } from "@mui/material/styles";
import useStabilimentiSelect from "../../components/fetching/useStabilimentiSelect";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import AggiungiDestinatario from "../../components/listaDistribuzione/aggiungiDestinatario";
import useListaDistribuzioneById from "../../components/fetching/useListaDistribuzioneById";
import useListaApprovazioneById from "../../components/fetching/useListaApprovazioneById";
import AggiungiUtenteAListaApprovazione from "../../components/listaApprovazione/aggiungiUtenteAListaApprovazione";

export default function Page() {
  const router = useRouter();
  const [id, setId] = useState(undefined);
  const instance = GetCurrentAxiosInstance();

  useEffect(() => {
    if (router.query.slug === undefined) return;
    setId(router.query.slug);
  }, [router.query.slug]);

  useEffect(() => {
    if (id === undefined || id === "nuovo") return;
    trigger({ id: id });
  }, [id]);

  const { data, trigger, isMutating } = useListaApprovazioneById(id);
  const { stabilimentiList } = useStabilimentiSelect();

  useEffect(() => {
    if (data === undefined) return;
    reset({
      id: data.id,
      codice: data.codice,
      minValue: data.minValue,
      maxValue: data.maxValue,
      idStabilimento: data.idStabilimento,
      includiCommerciale: data.includiCommerciale,
      utenteList: data.utenteList,
    });
  }, [data]);

  const form = useForm({
    defaultValues: {
      id: null,
      codice: null,
      minValue: 0,
      maxValue: 0,
      idStabilimento: null,
      includiCommerciale: false,
      utenteList: [],
    },
  });

  const {
    register,
    handleSubmit,
    formState,
    reset,
    control,
    watch,
    setValue,
    getValues,
  } = form;
  const { errors } = formState;

  const onSubmit = (data) => {
    if (data.id === undefined || data.id === "nuovo" || data.id === null) {
      instance
        .post(getApiUrl() + "api/listaApprovazione/nuovo", data)
        .then((response) => {
          setId(response.data);
          mandaNotifica("Creazione completata con successo", "success");
        })
        .catch(() => mandaNotifica("Creazione fallita", "error"));
    } else {
      instance
        .post(getApiUrl() + "api/listaApprovazione/update", data)
        .then(() => {
          mandaNotifica("Aggiornamento completato con successo", "success");
        })
        .catch(() => mandaNotifica("Impossibile aggiornare", "error"));
    }
  };

  const elimina = () => {
    instance
      .post(getApiUrl() + "api/listaApprovazione/delete?id=" + id)
      .then(() => {
        mandaNotifica("Eliminazione completata con successo", "success");
        router.back();
      })
      .catch(() =>
        mandaNotifica(
          "Impossibile cancellare, probabilmente l'elemento è utilizzato da un altra entità",
          "error"
        )
      );
  };

  const onSubmitAggiungiRiga = (datoIngresso) => {
    const listaAttuale = getValues("utenteList");
    if (
      listaAttuale.find(
        (x) =>
          x.idUtente === datoIngresso.idUtente ||
          x.numero === datoIngresso.numero
      ) === undefined
    )
      setValue("utenteList", [...listaAttuale, datoIngresso]);
  };

  const rimuoviDaLista = (index) => {
    const utenteList = getValues("utenteList");
    setValue(
      "utenteList",
      utenteList.filter((x, idx) => idx !== index)
    );
  };

  return (
    <Paper sx={{ m: 2, p: 2 }}>
      <Stack
        direction={"column"}
        component="form"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        spacing={1}
      >
        <Typography>Form modifica lista di approvazione</Typography>
        {!isMutating ? (
          <Stack direction={"column"} spacing={1}>
            {id !== undefined ? (
              <TextField
                {...register("codice", {
                  required: "Il codice è obbligatorio",
                })}
                size="small"
                margin="normal"
                required
                id="codice"
                label="Codice"
                defaultValue={" "}
                name="codice"
                error={!!errors.codice}
                helperText={errors.codice?.message}
                autoFocus
              />
            ) : (
              <></>
            )}
            <TextField
              {...register("minValue", {
                required: "Il valore minimo è obbligatorio",
              })}
              size="small"
              margin="normal"
              required
              id="minValue"
              label="Valore reclamo minimo"
              defaultValue={0}
              name="minValue"
              error={!!errors.minValue}
              helperText={errors.minValue?.message}
              type="number"
            />
            <TextField
              {...register("maxValue", {
                required: "Il valore massimo è obbligatorio",
              })}
              size="small"
              margin="normal"
              required
              id="maxValue"
              label="Valore reclamo massimo"
              defaultValue={0}
              name="maxValue"
              error={!!errors.maxValue}
              helperText={errors.maxValue?.message}
              type="number"
            />
            {stabilimentiList ? (
              <MyReactSelect
                control={control}
                name="idStabilimento"
                validation={{
                  required: "Lo stabilimento è obbligatorio",
                }}
                label="Stabilimento"
                options={stabilimentiList}
                autosize={true}
                menuPortalTarget={document.body}
                menuPosition={"fixed"}
              />
            ) : (
              <></>
            )}
            <Controller
              control={control}
              name={"includiCommerciale"}
              render={({ field: { onChange, value } }) => (
                <FormControlLabel
                  control={<Checkbox checked={value} onChange={onChange} />}
                  label="Richiedi approvazione del commerciale di riferimento del cliente"
                />
              )}
            />
            <Typography variant="button">
              Utenti approvatori in ordine di sequenza di approvazione
            </Typography>
            <AggiungiUtenteAListaApprovazione onSubmit={onSubmitAggiungiRiga} />
            <TableContainer>
              <Table aria-label="tabella destinatari">
                <TableHead>
                  <TableRow>
                    <TableCell>Posto approvazione</TableCell>
                    <TableCell>Utente</TableCell>
                    <TableCell>-</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {watch("utenteList").map((dato, index) => (
                    <TableRow
                      key={
                        dato.idUtente +
                        " - " +
                        dato.usernameUtente +
                        " - " +
                        dato.numero
                      }
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell>{dato.numero}</TableCell>
                      <TableCell>{dato.usernameUtente}</TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => rimuoviDaLista(index)}
                        >
                          Rimuovi
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Stack>
        ) : (
          <></>
        )}

        <Stack direction={"row"} spacing={1} mt={2}>
          <Button
            variant="outlined"
            color="error"
            onClick={() => elimina()}
            disabled={id === null || id === undefined || id === "nuovo"}
          >
            Elimina
          </Button>
          <Button variant="contained" type="submit">
            Salva
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}

Page.getLayout = function getLayout(page) {
  return (
    <Layout>
      <NestedLayout title={"LISTA DI APPROVAZIONE"}>{page}</NestedLayout>
    </Layout>
  );
};
