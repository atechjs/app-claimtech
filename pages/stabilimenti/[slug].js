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

  const { data, trigger, isMutating } = useStabilimentoById(id);
  const { sistemaEsternoList } = useAllSistemaEsternoSelect();

  useEffect(() => {
    if (data === undefined) return;
    reset({
      id: data.id,
      codice: data.codice,
      descrizione: data.descrizione,
      idSistemaEsterno: data.idSistemaEsterno,
      idLogo: data.idLogo,
      filenameLogo: data.filenameLogo,
      file: null,
    });
  }, [data]);

  const form = useForm({
    defaultValues: {
      id: null,
      codice: null,
      descrizione: null,
      idSistemaEsterno: null,
      idLogo: null,
      filenameLogo: null,
      file: null,
    },
  });

  const { register, handleSubmit, formState, reset, control, watch, setValue } =
    form;
  const { errors } = formState;

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("file", data.file);
    formData.append(
      "request",
      new Blob([JSON.stringify(data)], {
        type: "application/json",
      })
    );
    if (data.id === undefined || data.id === "nuovo" || data.id === null) {
      instance
        .post(getApiUrl() + "api/stabilimento/nuovo", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((response) => {
          setId(response.data);
          mandaNotifica("Creazione completata con successo", "success");
        })
        .catch(() => mandaNotifica("Creazione fallita", "error"));
    } else {
      instance
        .post(getApiUrl() + "api/stabilimento/update", formData)
        .then(() => {
          mandaNotifica("Aggiornamento completato con successo", "success");
        })
        .catch(() => mandaNotifica("Impossibile aggiornare", "error"));
    }
  };

  const elimina = () => {
    instance
      .post(getApiUrl() + "api/stabilimento/delete?id=" + id)
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

  const uploadLogo = (e) => {
    const files = Array.from(e.target.files);
    setValue("file", files[0]);
    setValue("filenameLogo", files[0].name);
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
        <Typography>Form modifica stabilimento</Typography>
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
            {sistemaEsternoList ? (
              <MyReactSelect
                control={control}
                name="idSistemaEsterno"
                validation={{
                  required: "Il sistema esterno è obbligatorio",
                }}
                label="Sistema esterno"
                options={sistemaEsternoList}
                menuPosition="fixed"
              />
            ) : (
              <></>
            )}
            <Stack direction={"row"}>
              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUploadIcon />}
              >
                {watch("filenameLogo") !== null
                  ? watch("filenameLogo")
                  : "Carica logo"}
                <VisuallyHiddenInput
                  type="file"
                  onChange={(e) => uploadLogo(e)}
                  accept="image/*"
                />
              </Button>
            </Stack>
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
      <NestedLayout title={"STABILIMENTO"}>{page}</NestedLayout>
    </Layout>
  );
};
