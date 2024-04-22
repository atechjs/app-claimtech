import {
  Button,
  Chip,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import MyDropzone from "../dropzone/myDropzone";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export default function DatiReso({
  onDatiResoSubmit,
  additionalControls = null,
  initialValues = undefined,
}) {
  const onDocumentoResoLoaded = (acceptedFiles) => {
    caricaFile(acceptedFiles, "fileReso");
  };

  const onDocumentoCmrLoaded = (acceptedFiles) => {
    caricaFile(acceptedFiles, "fileCmr");
  };

  const caricaFile = (acceptedFiles, codCampo) => {
    if (acceptedFiles.size == 0) return;
    const file = acceptedFiles[0];
    setValue(codCampo, file);
  };

  const schema = yup.object({
    codice: yup
      .string()
      .trim()
      .required("Il codice del documento di reso è obbligatorio"),
    fileReso: yup
      .mixed()
      .required("Il file del documento di reso è obbligatorio"),
  });

  const form = useForm({
    defaultValues:
      initialValues === undefined
        ? {
            codice: "",
            codiceCmr: "",
            data: null,
            fileReso: null,
            fileCmr: null,
          }
        : initialValues,
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

  const onFormSubmit = (values) => {
    onDatiResoSubmit(values);
  };

  const togliFileCmr = () => {
    setValue("fileCmr", null);
  };

  return (
    <Stack
      direction={"column"}
      component="form"
      noValidate
      onSubmit={handleSubmit(onFormSubmit)}
      spacing={2}
    >
      <Stack direction={"row"} spacing={1}>
        {additionalControls}
        <Button variant="contained" type="submit">
          Salva
        </Button>
      </Stack>
      <Paper>
        <Stack direction={"column"} p={1}>
          <Controller
            name="data"
            control={control}
            defaultValue={dayjs()}
            rules={{ required: "La data è obbligatoria" }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <DatePicker
                label="Data creazione*"
                format="DD/MM/YYYY"
                value={value}
                control={control}
                onChange={(event) => onChange(event)}
                slotProps={{
                  textField: {
                    error: !!error,
                    helperText: error?.message,
                    autoFocus: true,
                    size: "small",
                  },
                }}
              />
            )}
          />
        </Stack>
      </Paper>
      <Paper>
        <Stack direction={"column"} p={1}>
          <TextField
            {...register("codice", {
              required: "Il codice è obbligatorio",
            })}
            size="small"
            margin="normal"
            id="codice"
            label="Codice documento reso*"
            name="codice"
            error={!!errors.codice}
            helperText={errors.codice?.message}
            autoComplete="off"
          />
          <Typography>File documento di reso*</Typography>
          <Stack direction={"row"} width={"100%"}>
            {watch("fileReso") && watch("fileReso") !== null ? (
              <Chip label={watch("fileReso").name} sx={{ mt: 1, mb: 1 }} />
            ) : null}
          </Stack>
          <MyDropzone callback={onDocumentoResoLoaded} />
          <Typography color={"error"}>{errors.fileReso?.message}</Typography>
        </Stack>
      </Paper>
      <Paper>
        <Stack direction={"column"} p={1}>
          <TextField
            {...register("codiceCmr")}
            size="small"
            margin="normal"
            id="codiceCmr"
            label="Codice CMR"
            name="codiceCmr"
            error={!!errors.codiceCmr}
            helperText={errors.codiceCmr?.message}
            autoComplete="off"
          />
          <Typography>File documento CMR</Typography>
          <Stack direction={"row"} width={"100%"}>
            {watch("fileCmr") && watch("fileCmr") !== null ? (
              <Chip
                label={watch("fileCmr").name}
                sx={{ mt: 1, mb: 1 }}
                onDelete={() => togliFileCmr()}
              />
            ) : null}
          </Stack>
          <MyDropzone callback={onDocumentoCmrLoaded} />
          <Typography color={"error"}>{errors.fileCmr?.message}</Typography>
        </Stack>
      </Paper>
    </Stack>
  );
}
