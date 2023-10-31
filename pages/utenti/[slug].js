import React, { useEffect, useState } from "react";
import NestedLayout from "../../components/nestedLayout";
import Layout from "../../components/layout";
import { Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import GetCurrentAxiosInstance from "../../utils/Axios";
import getApiUrl from "../../utils/BeUrl";
import { mandaNotifica } from "../../utils/ToastUtils";
import MyReactSelect from "../../components/my-react-select-impl/myReactSelect";
import useUtenteById from "../../components/fetching/useUtenteById";
import useRuoliSelect from "../../components/fetching/useRuoliSelect";
import useStabilimentiSelect from "../../components/fetching/useStabilimentiSelect";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

export default function Page() {
  const router = useRouter();
  const [id, setId] = useState(undefined);
  const instance = GetCurrentAxiosInstance();

  const schema = yup.object({
    mail: yup.string().email("Mail deve essere una mail valida"),
  });

  useEffect(() => {
    if (router.query.slug === undefined) return;
    setId(router.query.slug);
  }, [router.query.slug]);

  useEffect(() => {
    if (id === undefined || id === "nuovo") return;
    trigger({ id: id });
  }, [id]);

  const { data, trigger, isMutating } = useUtenteById(id);
  const { ruoliList } = useRuoliSelect();
  const { stabilimentiList } = useStabilimentiSelect();

  useEffect(() => {
    if (data === undefined) return;
    reset({
      id: data.id,
      username: data.username,
      nome: data.nome,
      cognome: data.cognome,
      mail: data.mail,
      idRuolo: data.idRuolo,
      idStabilimento: data.idStabilimento,
    });
  }, [data]);

  const form = useForm({
    defaultValues: {
      id: null,
      username: null,
      password: null,
      nome: null,
      cognome: null,
      mail: null,
      idRuolo: null,
      idStabilimento: null,
    },
    resolver: yupResolver(schema),
  });

  const { register, handleSubmit, formState, reset, control } = form;
  const { errors } = formState;

  const onSubmit = (data) => {
    if (data.id === undefined || data.id === "nuovo" || data.id === null) {
      instance
        .post(getApiUrl() + "api/utente/nuovo", data)
        .then((response) => {
          setId(response.data);
          mandaNotifica("Creazione completata con successo", "success");
        })
        .catch(() => mandaNotifica("Creazione fallita", "error"));
    } else {
      instance
        .post(getApiUrl() + "api/utente/update", data)
        .then(() => {
          mandaNotifica("Aggiornamento completato con successo", "success");
        })
        .catch(() => mandaNotifica("Impossibile aggiornare", "error"));
    }
  };

  const elimina = () => {
    instance
      .post(getApiUrl() + "api/utente/delete?id=" + id)
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

  return (
    <Paper sx={{ m: 2, p: 2 }}>
      <Stack
        direction={"column"}
        component="form"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        spacing={1}
      >
        <Typography>Form modifica utente</Typography>
        {!isMutating ? (
          <Stack direction={"column"} spacing={1}>
            {id !== undefined ? (
              <TextField
                {...register("username", {
                  required: "Il codice è obbligatorio",
                })}
                size="small"
                margin="normal"
                required
                id="username"
                label="Username"
                defaultValue={" "}
                name="username"
                error={!!errors.username}
                helperText={errors.username?.message}
                autoFocus
              />
            ) : (
              <></>
            )}
            {id !== undefined ? (
              <TextField
                {...register("password")}
                size="small"
                margin="normal"
                id="password"
                label={
                  id === "nuovo"
                    ? "Password"
                    : "Nuova password(lasciare vuota per non cambiarla)"
                }
                required={id === "nuovo"}
                name="password"
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            ) : (
              <></>
            )}
            {id !== undefined ? (
              <TextField
                {...register("nome")}
                size="small"
                margin="normal"
                required
                id="nome"
                label="Nome"
                name="nome"
                error={!!errors.nome}
                helperText={errors.nome?.message}
              />
            ) : (
              <></>
            )}
            {id !== undefined ? (
              <TextField
                {...register("cognome")}
                size="small"
                margin="normal"
                required
                id="cognome"
                label="Cognome"
                name="cognome"
                error={!!errors.cognome}
                helperText={errors.cognome?.message}
                autoComplete="off"
              />
            ) : (
              <></>
            )}
            {id !== undefined ? (
              <TextField
                {...register("mail")}
                size="small"
                margin="normal"
                id="mail"
                label="Mail"
                name="mail"
                error={!!errors.mail}
                helperText={errors.mail?.message}
              />
            ) : (
              <></>
            )}
            {ruoliList ? (
              <MyReactSelect
                control={control}
                name="idRuolo"
                validation={{
                  required: "Il ruolo è obbligatorio",
                }}
                label="Ruolo"
                options={ruoliList}
                menuPosition="fixed"
              />
            ) : (
              <></>
            )}
            {stabilimentiList ? (
              <MyReactSelect
                control={control}
                name="idStabilimento"
                validation={{
                  required: "Lo stabilimento è obbligatorio",
                }}
                label="Stabilimento"
                options={stabilimentiList}
                menuPosition="fixed"
              />
            ) : (
              <></>
            )}
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
      <NestedLayout title={"UTENTE"}>{page}</NestedLayout>
    </Layout>
  );
};
