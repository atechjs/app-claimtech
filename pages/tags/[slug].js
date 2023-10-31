import React, { useEffect, useState } from "react";
import NestedLayout from "../../components/nestedLayout";
import Layout from "../../components/layout";
import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { MuiColorInput, matchIsValidColor } from "mui-color-input";
import useTagById from "../../components/fetching/useTagById";
import GetCurrentAxiosInstance from "../../utils/Axios";
import getApiUrl from "../../utils/BeUrl";
import { mandaNotifica } from "../../utils/ToastUtils";
export default function Page() {
  const router = useRouter();
  const [id, setId] = useState(undefined);
  const instance = GetCurrentAxiosInstance();

  useEffect(() => {
    if (router.query.slug === undefined) return;
    //Setto il form
    setId(router.query.slug);
  }, [router.query.slug]);

  useEffect(() => {
    if (id === undefined || id === "nuovo") return;
    trigger({ id: id });
  }, [id]);

  const { data, trigger, isMutating } = useTagById(id);

  useEffect(() => {
    if (data === undefined) return;
    reset({ id: data.id, descrizione: data.descrizione, colore: data.colore });
  }, [data]);

  const form = useForm({
    defaultValues: {
      id: null,
      descrizione: null,
      colore: "",
    },
  });
  const { register, handleSubmit, formState, reset, control, getValues } = form;
  const { errors } = formState;

  const onSubmit = (data) => {
    if (data.id === undefined || data.id === "nuovo" || data.id === null) {
      //Creo TAG e resetto id
      instance
        .post(getApiUrl() + "api/tag/nuovo", data)
        .then((response) => {
          setId(response.data);
          mandaNotifica("Tag creato correttamente", "success");
        })
        .catch(() => mandaNotifica("Impossibile creare il tag", "error"));
    } else {
      instance
        .post(getApiUrl() + "api/tag/update", data)
        .then(() => {
          mandaNotifica("Tag aggiornato correttamente", "success");
        })
        .catch(() => mandaNotifica("Impossibile aggiornare il tag", "error"));
    }
  };

  const elimina = () => {
    instance
      .post(getApiUrl() + "api/tag/delete?id=" + id)
      .then(() => {
        mandaNotifica("Tag eliminato correttamente", "success");
        router.back();
      })
      .catch(() => mandaNotifica("Impossibile eliminare il tag", "error"));
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
        <Typography>Form modifica TAG</Typography>
        {!isMutating ? (
          <TextField
            {...register("descrizione", {
              required: "La descrizione è obbligatoria",
            })}
            size="small"
            margin="normal"
            required
            id="descrizione"
            label="Descrizione"
            name="descrizione"
            error={!!errors.descrizione}
            helperText={errors.descrizione?.message}
            autoFocus
          />
        ) : (
          <></>
        )}
        <Typography variant="button">Colore</Typography>
        <Controller
          name="colore"
          control={control}
          rules={{ validate: matchIsValidColor }}
          render={({ field, fieldState }) => (
            <MuiColorInput
              {...field}
              format="hex"
              helperText={fieldState.invalid ? "Color is invalid" : ""}
              error={fieldState.invalid}
            />
          )}
        />
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
      <NestedLayout title={"TAG"}>{page}</NestedLayout>
    </Layout>
  );
};
