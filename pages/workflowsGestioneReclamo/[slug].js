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
import useWorkflowGestioneReclamoById from "../../components/fetching/useWorkflowGestioneReclamoById";
import useStatoFornituraSelect from "../../components/fetching/useStatoFornituraSelect";

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

  const { data, trigger, isMutating } = useWorkflowGestioneReclamoById(id);
  const { statoFornituraList: statoFornituraCausaReclamoList } =
    useStatoFornituraSelect();

  useEffect(() => {
    if (data === undefined) return;
    reset({
      id: data.id,
      codice: data.codice,
      descrizione: data.descrizione,
      idStatoFornituraCausaReclamoList: data.idStatoFornituraCausaReclamoList,
    });
  }, [data]);

  const form = useForm({
    defaultValues: {
      id: null,
      codice: null,
      descrizione: null,
      idStatoFornituraCausaReclamoList: [],
    },
  });

  const { register, handleSubmit, formState, reset, control, watch, setValue } =
    form;
  const { errors } = formState;

  const onSubmit = (data) => {
    if (data.id === undefined || data.id === "nuovo" || data.id === null) {
      instance
        .post(getApiUrl() + "api/workflowGestioneReclamo/nuovo", data)
        .then((response) => {
          setId(response.data);
          mandaNotifica("Creazione completata con successo", "success");
        })
        .catch(() => mandaNotifica("Creazione fallita", "error"));
    } else {
      instance
        .post(getApiUrl() + "api/workflowGestioneReclamo/update", data)
        .then(() => {
          mandaNotifica("Aggiornamento completato con successo", "success");
        })
        .catch(() => mandaNotifica("Impossibile aggiornare", "error"));
    }
  };

  const elimina = () => {
    instance
      .post(getApiUrl() + "api/workflowGestioneReclamo/delete?id=" + id)
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
        <Typography>Form modifica workflow gestione reclamo</Typography>
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
            {id !== undefined ? (
              <TextField
                {...register("descrizione")}
                size="small"
                margin="normal"
                required
                id="descrizione"
                label="Descrizione"
                name="descrizione"
                error={!!errors.descrizione}
                helperText={errors.descrizione?.message}
              />
            ) : (
              <></>
            )}
            {statoFornituraCausaReclamoList ? (
              <MyReactSelect
                control={control}
                name="idStatoFornituraCausaReclamoList"
                validation={{
                  required: "Gli stati fornitura sono obbligatori",
                }}
                label="Stati forniture"
                options={statoFornituraCausaReclamoList}
                menuPosition="fixed"
                isMulti={true}
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
      <NestedLayout title={"WORKFLOW GESTIONE RECLAMO"}>{page}</NestedLayout>
    </Layout>
  );
};
