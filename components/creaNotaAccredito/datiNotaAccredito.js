import { Button, Stack, TextField, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

export default function DatiNotaAccredito({
  onFormSubmit,
  initialValues = undefined,
  codicevaluta = undefined,
  additionalComponents = null,
}) {
  const form = useForm({
    defaultValues: initialValues
      ? initialValues
      : {
          codice: "",
          tipo: "",
          anno: "",
          numero: "",
          data: dayjs(),
          valoreValuta: "",
          valoreEuro: " ",
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

  useEffect(() => {
    reset(initialValues);
  }, initialValues);

  return (
    <Stack
      direction={"column"}
      spacing={2}
      component="form"
      noValidate
      onSubmit={handleSubmit(onFormSubmit)}
    >
      <Stack direction={"row"} spacing={1}>
        {additionalComponents}
        <Button variant="contained" type="submit">
          Salva
        </Button>
      </Stack>
      <Typography>Dati nota accredito</Typography>
      <Stack direction={"row"} spacing={2}>
        <TextField
          {...register("codice", {
            required: "Il codice è obbligatorio",
          })}
          size="small"
          margin="normal"
          required
          id="codice"
          label="Codice nota accredito"
          name="codice"
          error={!!errors.codice}
          fullWidth
          helperText={errors.codice?.message}
          onChange={(event) => {
            const value = event.target.value;
            let tipo = "";
            let anno = "";
            let numero = "";
            //CN020230000214
            if (value.length > 13) {
              tipo = value.substring(0, 3);
              anno = value.substring(3, 7);
              numero = Number(value.substring(7));
            }
            setValue("codice", value);
            setValue("tipo", tipo);
            setValue("anno", anno);
            setValue("numero", numero);
          }}
          autoFocus
          autoComplete="off"
        />
        <TextField
          {...register("tipo")}
          size="small"
          margin="normal"
          id="tipo"
          label="Tipo"
          name="tipo"
          error={!!errors.tipo}
          helperText={errors.tipo?.message}
          InputProps={{
            readOnly: true,
          }}
          value={watch("tipo") || ""}
        />
        <TextField
          {...register("anno")}
          size="small"
          margin="normal"
          id="anno"
          label="Anno"
          name="anno"
          error={!!errors.anno}
          helperText={errors.anno?.message}
          InputProps={{
            readOnly: true,
          }}
          value={watch("anno") || ""}
        />
        <TextField
          {...register("numero")}
          size="small"
          margin="normal"
          id="numero"
          label="Numero"
          name="numero"
          error={!!errors.numero}
          helperText={errors.numero?.message}
          InputProps={{
            readOnly: true,
          }}
          value={watch("numero") || ""}
        />
      </Stack>
      <Controller
        name="data"
        control={control}
        defaultValue={dayjs()}
        rules={{ required: "La data è obbligatoria" }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <DatePicker
            label="Data*"
            format="DD/MM/YYYY"
            value={value}
            control={control}
            onChange={(event) => onChange(event)}
            slotProps={{
              textField: { error: !!error, helperText: error?.message },
            }}
          />
        )}
      />
      {codicevaluta ? (
        <Stack direction={"row"} spacing={1}>
          <TextField
            {...register("valoreValuta", {
              required: "Il valore è obbligatorio",
            })}
            size="small"
            margin="normal"
            id="valoreValuta"
            label={"Valore nota accredito (" + codicevaluta + ")"}
            name="valoreValuta"
            type="number"
            error={!!errors.valoreValuta}
            helperText={errors.valoreValuta?.message}
            required
            InputProps={{
              readOnly: true,
            }}
            autoComplete="off"
          />
          <TextField
            {...register("valoreEuro", {
              required: "Il valore è obbligatorio",
            })}
            size="small"
            margin="normal"
            id="valoreEuro"
            label={"Valore nota accredito EURO"}
            name="valoreEuro"
            type="number"
            error={!!errors.valoreEuro}
            helperText={errors.valoreEuro?.message}
            required
            InputProps={{
              readOnly: true,
            }}
            autoComplete="off"
          />
        </Stack>
      ) : null}
    </Stack>
  );
}
