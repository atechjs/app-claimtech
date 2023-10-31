import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import { useForm } from "react-hook-form";
import { Box, Button, Chip, Stack, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import SaveIcon from "@mui/icons-material/Save";
import MyDropzone from "../dropzone/myDropzone";
import GetCurrentAxiosInstance from "../../utils/Axios";
import getApiUrl from "../../utils/BeUrl";
import { mandaNotifica } from "../../utils/ToastUtils";
export default function DialogModificaNota({
  opened,
  handleClose,
  handleOnSubmit,
  nota,
}) {
  const instance = GetCurrentAxiosInstance();
  const [loading, setLoading] = useState(false);
  const form = useForm({
    defaultValues: {
      id: null,
      descrizione: "",
      fileList: [],
      files: [],
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
    reset({ ...nota, files: [] });
  }, [nota]);

  const submitForm = (values) => {
    setLoading(true);
    const formData = new FormData();
    values.files.forEach((file) => {
      formData.append("files", file);
    });
    formData.append("fileList", values.fileList);
    formData.append("descrizione", values.descrizione);
    formData.append("id", values.id);

    instance
      .post(getApiUrl() + "api/reclamo/updateNota", formData)
      .then((response) => {
        mandaNotifica("Nota aggiornata con successo", "success");
        setLoading(false);
        handleOnSubmit();
      })
      .catch((error) => {
        mandaNotifica("Impossibile aggiornare la nota", "error");
        setLoading(false);
      });
  };

  const onFileLoaded = (acceptedFiles) => {
    setValue("files", getValues("files").concat(acceptedFiles));
  };

  const handleRemoveFile = (file, arr) => {
    setValue(
      arr,
      getValues(arr).filter((x) => x !== file)
    );
  };

  return (
    <Dialog open={opened} onClose={handleClose} sx={{ p: 2 }} fullScreen>
      <DialogTitle>Modifica nota</DialogTitle>
      <Stack
        direction={"column"}
        component="form"
        noValidate
        onSubmit={handleSubmit(submitForm)}
        spacing={1}
        p={2}
      >
        <TextField
          {...register("descrizione", {
            required: "La descrizione è obbligatoria",
          })}
          size="small"
          margin="normal"
          required
          id="descrizione"
          label="Descrizione"
          name="descrizione"
          helperText={errors.descrizione?.message}
          multiline
          rows={6}
          autoFocus
          fullWidth
        />
        <Box sx={{ flexWrap: "wrap" }}>
          {watch("fileList") &&
            watch("fileList").map((f) => (
              <Chip
                label={f.filename}
                onDelete={() => handleRemoveFile(f, "fileList")}
                sx={{ margin: 0.5 }}
              />
            ))}
          {watch("files").map((f) => (
            <Chip
              label={f.name}
              onDelete={() => handleRemoveFile(f, "files")}
              sx={{ margin: 0.5 }}
            />
          ))}
        </Box>
        <MyDropzone callback={onFileLoaded} />
        <Stack direction={"row-reverse"}>
          <LoadingButton
            variant="contained"
            type="submit"
            startIcon={<SaveIcon />}
            disabled={watch("descrizione") === ""}
            loading={loading}
          >
            Modifica
          </LoadingButton>
          <Button onClick={() => handleClose()}>Annulla</Button>
        </Stack>
      </Stack>
    </Dialog>
  );
}
