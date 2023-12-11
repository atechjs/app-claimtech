import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import { useForm } from "react-hook-form";
import {
  Box,
  Button,
  Chip,
  Stack,
  TextField,
  Typography,
  Tooltip,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import SaveIcon from "@mui/icons-material/Save";
import MyDropzone from "../../dropzone/myDropzone";
import GetCurrentAxiosInstance from "../../../utils/Axios";
import axios from "axios";
import getApiUrl from "../../../utils/BeUrl";
export default function DialogAllegati({
  opened,
  handleClose,
  handleOnSubmit,
  allegato,
  row,
}) {
  const instance = GetCurrentAxiosInstance();
  const [loading, setLoading] = useState(false);
  const form = useForm({
    defaultValues: {
      id: null,
      descrizione: "",
      filename: null,
      tempIndex: null,
      file: null,
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
    reset({ ...allegato });
  }, [allegato]);

  const onFileLoaded = (acceptedFiles) => {
    if (!acceptedFiles || acceptedFiles.length === 0) return;
    setValue("file", acceptedFiles[0]);
    setValue("filename", acceptedFiles[0].name);
    if (getValues("descrizione") === null || getValues("descrizione") === "")
      setValue("descrizione", acceptedFiles[0].name);
  };

  const handleRemoveFile = () => {
    setValue("file", null);
    setValue("filename", null);
  };

  const downloadFileAllegato = () => {
    axios({
      url:
        getApiUrl() +
        "api/reclamo/downloadFileAllegatoEvidenza?id=" +
        allegato.id,
      method: "GET",
      responseType: "blob",
    }).then((response) => {
      const href = URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = href;
      link.setAttribute("download", allegato.filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(href);
    });
  };

  return (
    <Dialog open={opened} onClose={handleClose} sx={{ p: 2 }}>
      <DialogTitle>
        {!allegato || allegato.id !== null
          ? "Modifica allegato"
          : "Nuovo allegato"}
      </DialogTitle>
      <Stack
        direction={"column"}
        component="form"
        noValidate
        onSubmit={handleSubmit(handleOnSubmit)}
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
          autoFocus
          fullWidth
        />
        {(watch("file") === undefined || watch("file") === null) &&
        watch("filename") !== null ? (
          <>
            <Typography variant="button">File allegato</Typography>
            <Tooltip title={"Download"}>
              <Chip
                label={watch("filename")}
                onDelete={() => handleRemoveFile()}
                onClick={() => downloadFileAllegato()}
                sx={{ margin: 0.5 }}
              />
            </Tooltip>
          </>
        ) : null}
        {watch("file") && watch("file") !== null ? (
          <>
            <Typography variant="button">File caricato</Typography>
            <Chip
              label={watch("file").name}
              onDelete={() => handleRemoveFile()}
              sx={{ margin: 0.5 }}
            />
          </>
        ) : null}
        <MyDropzone callback={onFileLoaded} />
        <Stack direction={"row-reverse"}>
          <LoadingButton
            variant="contained"
            type="submit"
            disabled={
              !watch("descrizione") ||
              watch("descrizione") === "" ||
              watch("descrizione").length === 0
            }
            loading={loading}
          >
            Conferma
          </LoadingButton>
          <Button onClick={() => handleClose()}>Annulla</Button>
        </Stack>
      </Stack>
    </Dialog>
  );
}
