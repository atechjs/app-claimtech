import {
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import MyReactSelect from "../my-react-select-impl/myReactSelect";
import useTipologiaReclamoSelect from "../fetching/useTipologiaReclamoSelect";
import useCausaSelect from "../fetching/useCausaSelect";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

export default function DatiReclamo({ dataReclamo, onDatiInseriti }) {
  const { tipologiaReclamoList } = useTipologiaReclamoSelect();
  const { causaList } = useCausaSelect();

  const schema = yup.object({
    idTipologiaReclamo: yup.number("Obbligatorio").required("Obbligatorio"),
    idCausaReclamo: yup.number("Obbligatorio").required("Obbligatorio"),
  });

  const form = useForm({
    defaultValues: {
      codiceCliente: dataReclamo.codiceCliente,
      descrizioneCliente: dataReclamo.descrizioneCliente,
      timestampCreazione: dayjs(),
      idTipologiaReclamo: 1,
      codiceReclamoCliente: null,
      idCausaReclamo: null,
      noteGenerali: null,
      includiRateo: false,
      inviaComunicazioni: true,
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
    const causaReclamo = causaList.find((x) => x.value === data.idCausaReclamo);
    data = { ...data, idCausaReclamoList: [causaReclamo] };
    onDatiInseriti(data);
  };

  const selectStyles = {
    menu: (base) => ({
      ...base,
      zIndex: 100,
    }),
  };

  return (
    <Paper>
      <Stack
        direction={"column"}
        spacing={1}
        component="form"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        p={1}
      >
        <Typography>Inserimento dati reclamo</Typography>
        <Stack direction={"row"} spacing={1}>
          <TextField
            {...register("codiceCliente")}
            size="small"
            margin="normal"
            required
            id="codiceCliente"
            label="Codice cliente"
            name="codiceCliente"
            error={!!errors.codiceCliente}
            helperText={errors.codiceCliente?.message}
            InputProps={{
              readOnly: true,
            }}
            fullWidth
          />
          <TextField
            {...register("descrizioneCliente")}
            size="small"
            margin="normal"
            required
            id="descrizioneCliente"
            label="Descrizione cliente"
            name="descrizioneCliente"
            error={!!errors.descrizioneCliente}
            helperText={errors.descrizioneCliente?.message}
            InputProps={{
              readOnly: true,
            }}
            fullWidth
          />
        </Stack>
        <Divider />
        <Controller
          name="timestampCreazione"
          control={control}
          rules={{ required: "La data è obbligatoria" }}
          defaultValue={null}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <DatePicker
              label="Aperto il"
              format="DD/MM/YYYY"
              value={dayjs(value)}
              control={control}
              onChange={(event) => onChange(event)}
              slotProps={{
                textField: {
                  error: !!error,
                  helperText: error?.message,
                  size: "small",
                },
              }}
            />
          )}
        />
        <TextField
          {...register("codiceReclamoCliente")}
          size="small"
          margin="normal"
          id="codiceReclamoCliente"
          label="Codice reclamo cliente"
          name="codiceReclamoCliente"
          error={!!errors.codiceReclamoCliente}
          helperText={errors.codiceReclamoCliente?.message}
          autoFocus
        />
        <Stack direction={"row"} spacing={1}>
          {tipologiaReclamoList ? (
            <MyReactSelect
              control={control}
              name="idTipologiaReclamo"
              label="Tipologia reclamo*"
              options={tipologiaReclamoList}
              styles={selectStyles}
            />
          ) : (
            <></>
          )}

          {causaList ? (
            <MyReactSelect
              control={control}
              name="idCausaReclamo"
              label="Causa reclamo*"
              options={causaList}
            />
          ) : (
            <></>
          )}
        </Stack>
        <Stack direction={"row"} spacing={1}>
          <Controller
            control={control}
            name={"includiRateo"}
            render={({ field: { onChange, value } }) => (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={value}
                    onChange={(e) => {
                      setValue("esercizioRateo", null);
                      onChange(e.target.checked);
                    }}
                  />
                }
                label="Includi nel rateo"
              />
            )}
          />
          {watch("includiRateo") === true ? (
            <TextField
              {...register("esercizioRateo")}
              size="small"
              margin="normal"
              id="esercizioRateo"
              label="Esercizio rateo"
              name="esercizioRateo"
              error={!!errors.esercizioRateo}
              helperText={errors.esercizioRateo?.message}
              type="number"
            />
          ) : null}
          <Controller
            control={control}
            name={"inviaComunicazioni"}
            render={({ field: { onChange, value } }) => (
              <FormControlLabel
                control={<Checkbox checked={value} onChange={onChange} />}
                label="Invia comunicazioni"
              />
            )}
          />
        </Stack>
        <TextField
          {...register("noteGenerali")}
          size="small"
          margin="normal"
          id="noteGenerali"
          label="Note generali"
          name="noteGenerali"
          error={!!errors.noteGenerali}
          helperText={errors.noteGenerali?.message}
          multiline
          minRows={4}
        />
        <Stack direction={"row"}>
          <Button type="submit" variant="contained">
            Salva
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}
