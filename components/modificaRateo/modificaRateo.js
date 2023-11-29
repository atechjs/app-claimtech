import {
  Button,
  Stack,
  Checkbox,
  FormControlLabel,
  TextField,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import React from "react";
import dayjs from "dayjs";
export default function ModificaRateo({ onSubmit, onBack }) {
  const form = useForm({
    defaultValues: {
      includiRateo: true,
      esercizioRateo: dayjs().get("y"),
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
    setValue,
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
      <Stack width={"100%"} spacing={2} direction={"row"}>
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
        {watch("includiRateo") ? (
          <TextField
            {...register("esercizioRateo")}
            size="small"
            margin="normal"
            id="esercizioRateo"
            label="Esercizio rateo"
            name="esercizioRateo"
            type="number"
          />
        ) : null}
      </Stack>
      <Stack direction={"row-reverse"}>
        <Button
          type="submit"
          variant="contained"
          disabled={
            (watch("esercizioRateo") === null ||
              watch("esercizioRateo") === undefined ||
              watch("esercizioRateo").toString().length < 4) &&
            watch("includiRateo")
          }
        >
          Salva
        </Button>
        <Button variant="text" onClick={() => onBack()}>
          Annulla
        </Button>
      </Stack>
    </Stack>
  );
}
