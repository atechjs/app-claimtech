import React, { useEffect, useState } from "react";
import NestedLayout from "../../components/nestedLayout";
import Layout from "../../components/layout";
import {
  Box,
  Button,
  Chip,
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
import useFormById from "../../components/fetching/useFormById";
import Campo from "../../components/formReclamo/Campo";
import { getValue } from "@mui/system";

export default function Page() {
  const router = useRouter();
  const [id, setId] = useState(undefined);
  const instance = GetCurrentAxiosInstance();
  const [nuovoCampo, setNuovoCampo] = useState(undefined);
  const [campoList, setCampoList] = useState([]);
  const [modificaInAtto, setModificaInAtto] = useState(false);

  useEffect(() => {
    if (router.query.slug === undefined) return;
    setId(router.query.slug);
  }, [router.query.slug]);

  useEffect(() => {
    if (id === undefined || id === "nuovo") return;
    trigger({ id: id });
  }, [id]);

  const { data, trigger, isMutating } = useFormById(id);

  useEffect(() => {
    if (data === undefined) return;
    reset({
      id: data.id,
      codice: data.codice,
      exprValuta: data.exprValuta ? data.exprValuta : " ",
      campoList: data.campoList,
    });
    setCampoList(data.campoList);
  }, [data]);

  const form = useForm({
    defaultValues: {
      id: null,
      codice: null,
      exprValuta: " ",
      campoList: [],
    },
  });
  const {
    register,
    handleSubmit,
    formState,
    reset,
    control,
    getValues,
    setValue,
    watch,
  } = form;
  const { errors } = formState;

  const copia = () => {
    setValue("id", null);
    setValue("codice", getValues("codice") + "_COPIA");
    onSubmit(getValues());
  };

  const onSubmit = (data) => {
    if (data.id === undefined || data.id === "nuovo" || data.id === null) {
      instance
        .post(getApiUrl() + "api/form/nuovo", data)
        .then((response) => {
          setId(response.data);
          mandaNotifica("Creazione completata con successo", "success");
        })
        .catch(() => mandaNotifica("Creazione fallita", "error"));
    } else {
      instance
        .post(getApiUrl() + "api/form/update", data)
        .then((response) => {
          setId(response.data);
          mandaNotifica("Aggiornamento completato con successo", "success");
        })
        .catch(() => mandaNotifica("Impossibile aggiornare", "error"));
    }
  };
  const elimina = () => {
    instance
      .post(getApiUrl() + "api/form/delete?id=" + id)
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

  const callbackTrueModificaInAtto = () => {
    setModificaInAtto(true);
  };

  const aggiungiCampo = () => {
    const campoList = getValues("campoList");
    const numSequenza =
      campoList.length === 0
        ? 1
        : Math.max(...campoList.map((o) => o.numSequenza)) + 1;
    const nuovoCampo = {
      id: null,
      codice: "nuovo",
      nome: null,
      nomeInglese: null,
      numSequenza: numSequenza,
      idTipo: null,
      idUnitaMisura: null,
      includiNelReso: false,
      idEtichettaCampo: null,
      idVisualizzazioneList: [],
      associazioneList: [],
    };
    setNuovoCampo(nuovoCampo);
  };

  const onCreaCampo = (codice, values) => {
    setValue("campoList", [...getValues("campoList"), values]);
    setCampoList([...campoList, values]);
    chiudiNuovoCampo(values);
  };

  const chiudiNuovoCampo = (values) => {
    setNuovoCampo(undefined);
  };

  const onSalvaCampo = (codice, values) => {
    let cl = getValues("campoList");
    console.log("values", values);
    const idx = cl.findIndex((campo) => campo.codice === codice);
    if (idx !== -1) {
      cl[idx] = values;
      setValue("campoList", cl);
      setCampoList(cl);
      setModificaInAtto(false);
    }
  };

  const onDeleteCampo = (values) => {
    const cl = getValues("campoList").filter(
      (campo) => campo.codice !== values.codice
    );
    setCampoList([]);
    setValue("campoList", cl);
    setCampoList(cl);
    setModificaInAtto(false);
  };

  const inserisciInExprValuta = (value) => {
    const expr = getValues("exprValuta");
    if (expr === undefined) setValue("exprValuta", "[" + value + "]");
    else {
      setValue("exprValuta", expr + "[" + value + "]");
    }
  };

  function compare(a, b) {
    return a.numSequenza > b.numSequenza
      ? 1
      : a.numSequenza < b.numSequenza
      ? -1
      : 0;
  }

  if (id === undefined || isMutating) return <></>;
  else
    return (
      <Paper sx={{ m: 2, p: 2 }}>
        <Stack
          direction={"column"}
          component="form"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          spacing={1}
          width={"100%"}
        >
          <Typography>Modifica form</Typography>
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
          <Divider />
          <Typography variant="button">Campi del form</Typography>
          <Stack direction={"row"} spacing={1}>
            <Button
              onClick={() => aggiungiCampo()}
              disabled={nuovoCampo !== undefined}
              variant="outlined"
            >
              Aggiungi campo
            </Button>
          </Stack>
          {nuovoCampo ? (
            <Campo
              data={nuovoCampo}
              onSalvaCampo={onCreaCampo}
              onDeleteCampo={chiudiNuovoCampo}
              mod={true}
              campoList={campoList.sort(
                (a, b) => a.numSequenza > b.numSequenza
              )}
              nuovo={true}
            />
          ) : (
            <></>
          )}
          <Typography variant="button">Lista campi</Typography>
          {campoList
            .sort((a, b) => compare(a, b))
            .map((campo) => (
              <Campo
                data={campo}
                onSalvaCampo={onSalvaCampo}
                onDeleteCampo={onDeleteCampo}
                modificaInAtto={modificaInAtto}
                callbackTrueModificaInAtto={callbackTrueModificaInAtto}
                campoList={campoList.sort((a, b) => compare(a, b))}
              />
            ))}
          <Divider />
          <Typography variant="button">
            Espressione calcolo costo del reclamo
          </Typography>
          <Typography variant="body1">
            Premi su un pulsante per inserire la variabile nell'espressione.
          </Typography>
          <Box sx={{ flexWrap: "wrap" }}>
            {campoList.map((campo) => (
              <Chip
                label={campo.nome}
                onClick={() => inserisciInExprValuta(campo.codice)}
                sx={{ margin: 0.5 }}
              />
            ))}
          </Box>
          <TextField
            {...register("exprValuta", {
              required:
                "L'espressione per calcolare il costo del reclamo è obbligatoria",
            })}
            size="small"
            margin="normal"
            required
            id="exprValuta"
            label="Espressione costo reclamo"
            defaultValue={" "}
            name="exprValuta"
            error={!!errors.exprValuta}
            helperText={errors.exprValuta?.message}
            fullWidth
          />
          <Divider />
          <Stack direction={"row"} spacing={1} mt={2}>
            <Button
              variant="outlined"
              color="error"
              onClick={() => elimina()}
              disabled={id === null || id === undefined || id === "nuovo"}
            >
              Elimina
            </Button>
            <Button
              variant="outlined"
              onClick={() => copia()}
              disabled={modificaInAtto}
            >
              Copia
            </Button>
            <Button variant="contained" type="submit" disabled={modificaInAtto}>
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
      <NestedLayout title={"FORM"}>{page}</NestedLayout>
    </Layout>
  );
};
