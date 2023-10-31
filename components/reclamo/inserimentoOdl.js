import {
  Button,
  LinearProgress,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import SearchIcon from "@mui/icons-material/Search";
import GetCurrentAxiosInstance from "../../utils/Axios";
import getApiUrl from "../../utils/BeUrl";
import { mandaNotifica } from "../../utils/ToastUtils";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

export default function InserimentoOdl({ onOdlInserito }) {
  const instance = GetCurrentAxiosInstance();
  const [isLoading, setIsLoading] = useState(false);

  const schema = yup.object({
    tipo: yup
      .string("Tipo non valido")
      .min(3, "Tipo non valido")
      .max(3, "Tipo non valido")
      .required("Tipo non valido"),
    anno: yup
      .number("Anno non valido")
      .min(1000, "Anno non valido")
      .max(9999, "Anno non valido")
      .required("Anno non valido")
      .typeError("Anno non valido"),
    numero: yup
      .number("Numero non valido")
      .min(0, "Numero non valido")
      .max(9999, "Numero non valido")
      .required("Numero non valido")
      .typeError("Numero non valido"),
  });

  const form = useForm({
    defaultValues: {
      tipo: null,
      anno: null,
      numero: null,
    },
    resolver: yupResolver(schema),
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

  const onSubmit = (data) => {
    setIsLoading(true);
    instance
      .post(getApiUrl() + "api/reclamo/ricercaByOdl", data)
      .then((response) => {
        onOdlInserito(response.data);
      })
      .catch((error) => {
        if (error.response.data.message === "Odl non trovato")
          mandaNotifica("ODL non trovato", "warning");
        else
          mandaNotifica(
            "Si sono verificati errori nella ricerca dell'ODL",
            "error"
          );
      })
      .then(() => setIsLoading(false));
  };

  return (
    <Stack direction={"column"} spacing={1} width={"100%"}>
      <Paper>
        <Stack direction={"column"} spacing={1} width={"100%"} p={1}>
          <Typography>Inserimento dati da sistema esterno</Typography>
          <Stack
            direction={"row"}
            spacing={1}
            component="form"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
          >
            <TextField
              {...register("tipo", {
                required: "Il tipo è obbligatorio",
              })}
              size="small"
              margin="normal"
              required
              id="tipo"
              label="Tipo commessa"
              name="tipo"
              error={!!errors.tipo}
              helperText={errors.tipo?.message}
              autoFocus
            />
            <TextField
              {...register("anno", {
                required: "L'anno è obbligatorio",
              })}
              size="small"
              margin="normal"
              required
              id="anno"
              label="Anno commessa"
              name="anno"
              error={!!errors.anno}
              helperText={errors.anno?.message}
              type="number"
            />
            <TextField
              {...register("numero", {
                required: "Il numero è obbligatorio",
              })}
              size="small"
              margin="normal"
              required
              id="numero"
              label="Numero commessa"
              name="numero"
              error={!!errors.numero}
              helperText={errors.numero?.message}
              type="number"
            />
            <Button
              type="submit"
              variant="contained"
              startIcon={<SearchIcon />}
              disabled={isLoading}
            >
              ricerca
            </Button>
          </Stack>
          {isLoading ? <LinearProgress /> : <></>}
        </Stack>
      </Paper>
    </Stack>
  );
}
