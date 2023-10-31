import React from "react";
import useCausaSelect from "../fetching/useCausaSelect";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import MyReactSelect from "../my-react-select-impl/myReactSelect";
import { Button, Stack } from "@mui/material";

export default function InserimentoCausaReclamo({ onCausaReclamoSelezionata }) {
  const { causaList } = useCausaSelect();

  const schema = yup.object({
    idCausaReclamo: yup.number("Obbligatorio").required("Obbligatorio"),
  });

  const onSubmit = (data) => {
    onCausaReclamoSelezionata(
      causaList.find((x) => x.value === data.idCausaReclamo)
    );
  };

  const form = useForm({
    defaultValues: {
      idCausaReclamo: null,
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

  return (
    <Stack
      direction={"column"}
      spacing={1}
      p={1}
      component="form"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
    >
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
      <Stack direction={"row"}>
        <Button type="submit" variant="contained">
          Salva
        </Button>
      </Stack>
    </Stack>
  );
}
