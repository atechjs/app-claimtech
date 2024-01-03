import { Button, Stack, TextField } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import MyReactSelect from "../my-react-select-impl/myReactSelect";
import useUtentiSelect from "../fetching/useUtentiSelect";

export default function AggiungiUtenteAListaApprovazione({ onSubmit }) {
  const form = useForm({
    defaultValues: {
      idUtente: null,
      numero: 1,
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
  const { utentiList } = useUtentiSelect();

  const onSubmitInternal = () => {
    let data = getValues();
    if (data.idUtente === null || numero === null || numero === "") return;
    data = {
      ...data,
      usernameUtente: utentiList.find((x) => x.value === data.idUtente).label,
    };
    setValue("idUtente", null);
    setValue("numero", numero + 1);
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
      {utentiList ? (
        <MyReactSelect
          control={control}
          name="idUtente"
          label="Utente"
          options={utentiList}
          autosize={true}
          menuPortalTarget={document.body}
          menuPosition={"fixed"}
          isFullWidth={true}
        />
      ) : (
        <></>
      )}
      <TextField
        {...register("numero", {
          required: "Il numero è obbligatorio",
        })}
        size="small"
        margin="normal"
        required
        id="numero"
        label="Numero sequenza"
        name="numero"
        error={!!errors.numero}
        helperText={errors.numero?.message}
        type="number"
      />
      <Button variant="outlined" onClick={() => onSubmitInternal()}>
        aggiungi
      </Button>
    </Stack>
  );
}
