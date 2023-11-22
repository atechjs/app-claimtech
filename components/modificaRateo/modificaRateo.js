import { Button, Stack, Checkbox, FormControlLabel } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import React from "react";
export default function ModificaRateo({ onSubmit, onBack }) {
  const form = useForm({
    defaultValues: {
      includiRateo: false,
    },
  });
  const {
    register,
    handleSubmit,
    formState,
    reset,
    control,
    getValues,
    watch,
  } = form;
  const { errors } = formState;

  const handleInternalSubmit = (data) => {
    onSubmit(data);
  };
  return (
    <Stack
      component="form"
      noValidate
      sx={{ mt: 1 }}
      onSubmit={handleSubmit(handleInternalSubmit)}
      direction={"column"}
      spacing={1}
      p={1}
    >
      <Controller
        control={control}
        name={"includiRateo"}
        render={({ field: { onChange, value } }) => (
          <FormControlLabel
            control={<Checkbox checked={value} onChange={onChange} />}
            label="Includi nel rateo"
          />
        )}
      />
      <Stack direction={"row-reverse"}>
        <Button type="submit" variant="contained">
          Salva
        </Button>
        <Button variant="text" onClick={() => onBack()}>
          Annulla
        </Button>
      </Stack>
    </Stack>
  );
}
