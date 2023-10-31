import React, { useEffect, useState } from "react";
import NestedLayout from "../../components/nestedLayout";
import Layout from "../../components/layout";
import {
  Button,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import GetCurrentAxiosInstance from "../../utils/Axios";
import getApiUrl from "../../utils/BeUrl";
import { mandaNotifica } from "../../utils/ToastUtils";
import useGruppoUtenteById from "../../components/fetching/useGruppoUtenteById";
import AggiungiUtente from "../../components/gruppoUtente/AggiungiUtente";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

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

  const { data, trigger, isMutating } = useGruppoUtenteById(id);

  useEffect(() => {
    if (data === undefined) return;
    reset({ id: data.id, codice: data.codice, utenteList: data.utenteList });
  }, [data]);

  const form = useForm({
    defaultValues: {
      id: null,
      codice: null,
      utenteList: [],
    },
  });
  const {
    register,
    handleSubmit,
    formState,
    reset,
    getValues,
    setValue,
    watch,
  } = form;
  const { errors } = formState;

  const onSubmit = (data) => {
    const utenteList = data.utenteList;
    data = { ...data, utenteList: utenteList.map((utente) => utente.id) };
    if (data.id === undefined || data.id === "nuovo" || data.id === null) {
      instance
        .post(getApiUrl() + "api/gruppoUtente/nuovo", data)
        .then((response) => {
          setId(response.data);
          mandaNotifica("Creazione completata con successo", "success");
        })
        .catch(() => mandaNotifica("Creazione fallita", "error"));
    } else {
      instance
        .post(getApiUrl() + "api/gruppoUtente/update", data)
        .then(() => {
          mandaNotifica("Aggiornamento completato con successo", "success");
        })
        .catch(() => mandaNotifica("Impossibile aggiornare", "error"));
    }
  };

  const elimina = () => {
    instance
      .post(getApiUrl() + "api/gruppoUtente/delete?id=" + id)
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

  const onAggiungiUtente = (data) => {
    const utenteList = getValues("utenteList");
    if (
      utenteList.find((utente) => utente.username === data.username) ===
      undefined
    )
      setValue("utenteList", [...utenteList, data]);
  };

  const rimuoviUtente = (dato) => {
    const utenteList = getValues("utenteList");
    setValue(
      "utenteList",
      utenteList.filter((x) => x.username !== dato.username)
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
        <Typography>Form modifica gruppo utente</Typography>
        {!isMutating ? (
          <TextField
            {...register("codice", {
              required: "Il codice è obbligatorio",
            })}
            size="small"
            margin="normal"
            required
            id="codice"
            label="Codice"
            name="codice"
            error={!!errors.codice}
            helperText={errors.codice?.message}
            autoFocus
          />
        ) : (
          <></>
        )}
        <Divider />
        <Typography variant="button">Utenti associati</Typography>
        <AggiungiUtente onSubmit={onAggiungiUtente} />
        <TableContainer>
          <Table aria-label="tabella utenti associati">
            <TableHead>
              <TableRow>
                <TableCell>Username</TableCell>
                <TableCell>Azione</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {watch("utenteList").map((dato) => (
                <TableRow
                  key={dato.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {dato.username}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => rimuoviUtente(dato)}
                    >
                      Rimuovi
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
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
      <NestedLayout title={"GRUPPO UTENTE"}>{page}</NestedLayout>
    </Layout>
  );
};
