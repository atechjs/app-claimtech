import { Button, Stack, TextField } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import useAllSistemaEsternoSelect from "../../components/fetching/useAllSistemaEsternoSelect";
import MyReactSelect from "../my-react-select-impl/myReactSelect";

export default function AggiungiDatiAggiuntiviCliente({ onSubmit }) {
  const form = useForm({
    defaultValues: {
      codice: null,
      ragioneSociale: null,
      idSistemaEsterno: null,
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
  } = form;
  const { errors } = formState;
  const { sistemaEsternoList, isLoading, error } = useAllSistemaEsternoSelect();
  const onSubmitInternal = () => {
    let data = getValues();
    data = {
      ...data,
      codiceSistemaEsterno: sistemaEsternoList.find(
        (x) => x.value === data.idSistemaEsterno
      ).label,
    };
    setValue("codice", null);
    setValue("ragioneSociale", null);
    setValue("idSistemaEsterno", null);
    onSubmit(data);
  };

  return (
    <Stack
      spacing={1}
      direction={"row"}
      justifyContent="flex-start"
      alignItems="flex-end"
      width={"100%"}
    >
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
      />
      <TextField
        {...register("ragioneSociale", {
          required: "La ragione sociale è obbligatorio",
        })}
        size="small"
        margin="normal"
        required
        id="ragioneSociale"
        label="Ragione sociale"
        name="ragioneSociale"
        error={!!errors.ragioneSociale}
        helperText={errors.ragioneSociale?.message}
      />
      {sistemaEsternoList ? (
        <MyReactSelect
          control={control}
          name="idSistemaEsterno"
          label="Sistema esterno"
          options={sistemaEsternoList}
          menuPosition="fixed"
          isFullWidth={true}
        />
      ) : (
        <></>
      )}
      <Button variant="outlined" onClick={() => onSubmitInternal()}>
        aggiungi
      </Button>
    </Stack>
  );
}
