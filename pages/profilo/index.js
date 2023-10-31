import React from "react";
import Layout from "../../components/layout";
import NestedLayout from "../../components/nestedLayout";
import { Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import GetCurrentAxiosInstance, { GetCurrentUser } from "../../utils/Axios";
import useGetProfilo from "../../components/fetching/useGetProfilo";
import getApiUrl from "../../utils/BeUrl";
import { mandaNotifica } from "../../utils/ToastUtils";

export default function Page() {
  const instance = GetCurrentAxiosInstance();

  const form = useForm({
    defaultValues: {
      id: null,
      username: "",
      password: "",
      nome: "",
      cognome: "",
      mail: "",
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

  const onSuccess = (data) => {
    reset(data);
  };

  const { data: profilo, mutate } = useGetProfilo(
    GetCurrentUser().username,
    onSuccess
  );

  const onSubmit = (data) => {
    instance
      .post(getApiUrl() + "api/utente/updateProfilo", data)
      .then((response) => {
        mandaNotifica("Profilo aggiornato correttamente", "success");
      })
      .catch(() => mandaNotifica("Impossibile aggiornare il profilo", "error"));
  };

  return (
    <Paper sx={{ m: 2, p: 2 }}>
      <Stack
        direction={"column"}
        spacing={1}
        component="form"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
      >
        <Typography>I tuoi dati</Typography>
        {watch("id") !== null ? (
          <>
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
              InputProps={{
                readOnly: true,
              }}
            />
            <TextField
              {...register("password")}
              size="small"
              margin="normal"
              id="password"
              label={"Nuova password(lasciare vuota per non cambiarla)"}
              name="password"
              error={!!errors.password}
              helperText={errors.password?.message}
            />
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
            <Stack direction={"row"} width={"100%"}>
              <Button variant="contained" color="primary" type="submit">
                Salva
              </Button>
            </Stack>
          </>
        ) : (
          <></>
        )}
      </Stack>
    </Paper>
  );
}

Page.getLayout = function getLayout(page) {
  return (
    <Layout>
      <NestedLayout title={"Il mio profilo"}>{page}</NestedLayout>
    </Layout>
  );
};
