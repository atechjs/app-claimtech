import React, { useEffect, useState } from "react";
import NestedLayout from "../../components/nestedLayout";
import Layout from "../../components/layout";
import { Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import GetCurrentAxiosInstance from "../../utils/Axios";
import getApiUrl from "../../utils/BeUrl";
import { mandaNotifica } from "../../utils/ToastUtils";
import useStabilimentoById from "../../components/fetching/useStabilimentoById";
import useAllSistemaEsternoSelect from "../../components/fetching/useAllSistemaEsternoSelect";
import MyReactSelect from "../../components/my-react-select-impl/myReactSelect";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import authServ from "../../services/auth.service";
import useStabilimentiSelect from "../../components/fetching/useStabilimentiSelect";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import AggiungiDestinatario from "../../components/listaDistribuzione/aggiungiDestinatario";
import useListaDistribuzioneById from "../../components/fetching/useListaDistribuzioneById";

export default function Page() {
  const router = useRouter();
  const [id, setId] = useState(undefined);
  const instance = GetCurrentAxiosInstance();

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  useEffect(() => {
    if (router.query.slug === undefined) return;
    setId(router.query.slug);
  }, [router.query.slug]);

  useEffect(() => {
    if (id === undefined || id === "nuovo") return;
    trigger({ id: id });
  }, [id]);

  const { data, trigger, isMutating } = useListaDistribuzioneById(id);
  const { stabilimentiList } = useStabilimentiSelect();

  useEffect(() => {
    if (data === undefined) return;
    reset({
      id: data.id,
      codice: data.codice,
      minValoreReclamo: data.minValoreReclamo,
      maxValoreReclamo: data.maxValoreReclamo,
      idStabilimento: data.idStabilimento,
      destinatarioList: data.destinatarioList,
    });
  }, [data]);

  const form = useForm({
    defaultValues: {
      id: null,
      codice: null,
      minValoreReclamo: 0,
      maxValoreReclamo: 0,
      idStabilimento: null,
      destinatarioList: [],
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
        .post(getApiUrl() + "api/listaDistribuzione/nuovo", data)
        .then((response) => {
          setId(response.data);
          mandaNotifica("Creazione completata con successo", "success");
        })
        .catch(() => mandaNotifica("Creazione fallita", "error"));
    } else {
      instance
        .post(getApiUrl() + "api/listaDistribuzione/update", data)
        .then(() => {
          mandaNotifica("Aggiornamento completato con successo", "success");
        })
        .catch(() => mandaNotifica("Impossibile aggiornare", "error"));
    }
  };

  const elimina = () => {
    instance
      .post(getApiUrl() + "api/listaDistribuzione/delete?id=" + id)
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

  const onSubmitAggiungiDestinatari = (destinatario) => {
    const destinatarioList = getValues("destinatarioList");
    if (
      destinatarioList.find(
        (x) =>
          x.indirizzo === destinatario.indirizzo &&
          x.idStatoFornituraCausaReclamo ===
            destinatario.idStatoFornituraCausaReclamo
      ) === undefined
    )
      setValue("destinatarioList", [...destinatarioList, destinatario]);
  };

  const rimuoviDestinatario = (index) => {
    const destinatarioList = getValues("destinatarioList");
    setValue(
      "destinatarioList",
      destinatarioList.filter((x, idx) => idx !== index)
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
        <Typography>Form modifica lista di distribuzione</Typography>
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
              {...register("minValoreReclamo", {
                required: "Il valore minimo è obbligatorio",
              })}
              size="small"
              margin="normal"
              required
              id="minValoreReclamo"
              label="Valore reclamo minimo"
              defaultValue={0}
              name="minValoreReclamo"
              error={!!errors.minValoreReclamo}
              helperText={errors.minValoreReclamo?.message}
              type="number"
            />
            <TextField
              {...register("maxValoreReclamo", {
                required: "Il valore massimo è obbligatorio",
              })}
              size="small"
              margin="normal"
              required
              id="maxValoreReclamo"
              label="Valore reclamo massimo"
              defaultValue={0}
              name="maxValoreReclamo"
              error={!!errors.maxValoreReclamo}
              helperText={errors.maxValoreReclamo?.message}
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
            <Typography variant="button">Destinatari</Typography>
            <AggiungiDestinatario onSubmit={onSubmitAggiungiDestinatari} />
            <TableContainer>
              <Table aria-label="tabella dati aggiuntivi cliente">
                <TableHead>
                  <TableRow>
                    <TableCell>Indirizzo</TableCell>
                    <TableCell>Quando mandare la mail</TableCell>
                    <TableCell>Tipologia</TableCell>
                    <TableCell>Azione</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {watch("destinatarioList").map((dato, index) => (
                    <TableRow
                      key={
                        dato.indirizzo +
                        " - " +
                        dato.idStatoFornituraCausaReclamo
                      }
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {dato.indirizzo}
                      </TableCell>
                      <TableCell>
                        {dato.codiceStatoFornituraCausaReclamo}
                      </TableCell>
                      <TableCell>{dato.codiceTipologiaDestinatario}</TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => rimuoviDestinatario(index)}
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
      <NestedLayout title={"LISTA DI DISTRIBUZIONE"}>{page}</NestedLayout>
    </Layout>
  );
};
