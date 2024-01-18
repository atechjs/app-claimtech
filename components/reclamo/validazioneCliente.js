import { Button, Paper, Stack, TextField, Typography } from "@mui/material";
import React, { useEffect } from "react";
import MyReactSelect from "../my-react-select-impl/myReactSelect";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import useUtentiSelect from "../fetching/useUtentiSelect";

export default function ValidazioneCliente({ dataReclamo, onClienteValidato }) {
  const schema = yup.object({
    costoCartaAdesivo: yup
      .number("Non valido")
      .min(0, "Non valido")
      .required("Non valido")
      .typeError("Non valido"),
    costoRibobinatrice: yup
      .number("Non valido")
      .min(0, "Non valido")
      .required("Non valido")
      .typeError("Non valido"),
    costoFermoMacchina: yup
      .number("Non valido")
      .min(0, "Non valido")
      .required("Non valido")
      .typeError("Non valido"),
  });

  const form = useForm({
    defaultValues: {
      codiceCliente: dataReclamo.codiceCliente,
      descrizioneCliente: dataReclamo.descrizioneCliente,
      costoCartaAdesivo: dataReclamo.costoCartaAdesivo,
      costoRibobinatrice: dataReclamo.costoRibobinatrice,
      costoFermoMacchina: dataReclamo.costoFermoMacchina,
      idForm: dataReclamo.idForm,
      idUtenteList: dataReclamo.idUtenteList,
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
  const { utentiList } = useUtentiSelect();
  if (dataReclamo.idCliente && dataReclamo.idCliente !== null)
    onClienteValidato(dataReclamo);

  const onSubmit = (data) => {
    onClienteValidato(data);
  };

  const selectStyles = {
    menu: (base) => ({
      ...base,
      zIndex: 100,
    }),
  };

  return (
    <Stack direction={"column"} spacing={1} width={"100%"}>
      <Paper>
        <Stack
          direction={"column"}
          spacing={1}
          component="form"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          p={1}
        >
          <Typography>Inserimento dati cliente</Typography>
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
          />
          <TextField
            {...register("descrizioneCliente")}
            size="small"
            margin="normal"
            required
            id="descrizioneCliente"
            label="Ragione sociale"
            name="descrizioneCliente"
            error={!!errors.descrizioneCliente}
            helperText={errors.descrizioneCliente?.message}
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            {...register("costoCartaAdesivo")}
            type="number"
            size="small"
            margin="normal"
            required
            id="costoCartaAdesivo"
            label="Costo carta e adesivo"
            name="costoCartaAdesivo"
            error={!!errors.costoCartaAdesivo}
            helperText={errors.costoCartaAdesivo?.message}
          />
          <TextField
            {...register("costoRibobinatrice")}
            type="number"
            size="small"
            margin="normal"
            required
            id="costoRibobinatrice"
            label="Costo ribobinatrice"
            name="costoRibobinatrice"
            error={!!errors.costoRibobinatrice}
            helperText={errors.costoRibobinatrice?.message}
          />
          <TextField
            {...register("costoFermoMacchina")}
            type="number"
            size="small"
            margin="normal"
            required
            id="costoFermoMacchina"
            label="Costo fermo macchina"
            name="costoFermoMacchina"
            error={!!errors.costoFermoMacchina}
            helperText={errors.costoFermoMacchina?.message}
          />
          {utentiList ? (
            <MyReactSelect
              control={control}
              name="idUtenteList"
              label="Commerciali associati"
              options={utentiList}
              styles={selectStyles}
              isMulti={true}
            />
          ) : (
            <></>
          )}
          <Stack direction={"row"} width={"100%"}>
            <Button type="submit" variant="contained">
              Aggiungi cliente
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  );
}
