import React, { useEffect, useState } from "react";
import NestedLayout from "../../components/nestedLayout";
import Layout from "../../components/layout";
import { Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import GetCurrentAxiosInstance from "../../utils/Axios";
import getApiUrl from "../../utils/BeUrl";
import { mandaNotifica } from "../../utils/ToastUtils";
import useCausaById from "../../components/fetching/useCausaById";
import useDifettoSelect from "../../components/fetching/useDifettoSelect";
import MyReactSelect from "../../components/my-react-select-impl/myReactSelect";

export default function Page() {
  const router = useRouter();
  const [id, setId] = useState(undefined);
  const instance = GetCurrentAxiosInstance();
  const { difettoList } = useDifettoSelect();

  useEffect(() => {
    if (router.query.slug === undefined) return;
    setId(router.query.slug);
  }, [router.query.slug]);

  useEffect(() => {
    if (id === undefined || id === "nuovo") return;
    trigger({ id: id });
  }, [id]);

  const { data, trigger, isMutating } = useCausaById(id);
  const selectStyles = {
    menu: (base) => ({
      ...base,
      zIndex: 100,
    }),
  };
  useEffect(() => {
    if (data === undefined) return;
    reset({
      id: data.id,
      codice: data.codice,
      codiceInglese: data.codiceInglese,
      idDifettoList: data.idDifettoList,
    });
  }, [data]);

  const form = useForm({
    defaultValues: {
      id: null,
      codice: null,
      codiceInglese: null,
      idDifettoList: [],
    },
  });
  const { register, handleSubmit, formState, reset, control } = form;
  const { errors } = formState;

  const onSubmit = (data) => {
    if (data.id === undefined || data.id === "nuovo" || data.id === null) {
      instance
        .post(getApiUrl() + "api/causaReclamo/nuovo", data)
        .then((response) => {
          setId(response.data);
          mandaNotifica("Creazione completata con successo", "success");
        })
        .catch(() => mandaNotifica("Creazione fallita", "error"));
    } else {
      instance
        .post(getApiUrl() + "api/causaReclamo/update", data)
        .then(() => {
          mandaNotifica("Aggiornamento completato con successo", "success");
        })
        .catch(() => mandaNotifica("Impossibile aggiornare", "error"));
    }
  };

  const elimina = () => {
    instance
      .post(getApiUrl() + "api/causaReclamo/delete?id=" + id)
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
        <Typography>Form modifica causa reclamo</Typography>
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
        {!isMutating ? (
          <TextField
            {...register("codiceInglese", {
              required: "La traduzione è obbligatoria",
            })}
            size="small"
            margin="normal"
            required
            id="codiceInglese"
            label="Traduzione"
            name="codiceInglese"
            error={!!errors.codiceInglese}
            helperText={errors.codiceInglese?.message}
          />
        ) : (
          <></>
        )}
        {difettoList ? (
          <MyReactSelect
            control={control}
            name="idDifettoList"
            label="Difetti inclusi"
            options={difettoList}
            styles={selectStyles}
            isMulti={true}
          />
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
      <NestedLayout title={"CAUSA RECLAMO"}>{page}</NestedLayout>
    </Layout>
  );
};
