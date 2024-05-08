import React, { useState } from "react";
import ReclamoNestedLayout from "../../../../components/reclamo/reclamoNestedLayout";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import MyDropzone from "../../../../components/dropzone/myDropzone";
import { useRouter } from "next/router";
import GetCurrentAxiosInstance from "../../../../utils/Axios";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import getApiUrl from "../../../../utils/BeUrl";
import { LoadingButton } from "@mui/lab";
import { mandaNotifica } from "../../../../utils/ToastUtils";
import useReclamoNote from "../../../../components/fetching/useReclamoNote";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import dayjs from "dayjs";
import DownloadIcon from "@mui/icons-material/Download";
import axios from "axios";
import DialogModificaNota from "../../../../components/note/dialogModificaNota";

export default function Page() {
  const router = useRouter();
  const instance = GetCurrentAxiosInstance();
  const [aggiungiNotaVisibile, setAggiungiNotaVisibile] = useState(false);
  const [aggiungiNotaLoading, setAggiungiNotaLoading] = useState(false);
  const [dialogModificaNotaOpened, setDialogModificaNotaOpened] =
    useState(false);
  const [selectedNota, setSelectedNota] = useState(undefined);

  const handleOpenDialogModificaNota = () => setDialogModificaNotaOpened(true);
  const handleCloseDialogModificaNota = () =>
    setDialogModificaNotaOpened(false);

  const onDataCaricata = (data) => {
    setList(data);
  };
  const [list, setList] = useState(undefined);
  const { data, mutate } = useReclamoNote(router.query.slug, onDataCaricata);
  const form = useForm({
    defaultValues: {
      descrizione: "",
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
  const onFileLoaded = (acceptedFiles) => {
    console.log("acceptedFiles", acceptedFiles);
    setValue("files", getValues("files").concat(acceptedFiles));
  };

  const chiudiSezioneSalvataggio = () => {
    reset({ descrizione: "", files: [] });
    setAggiungiNotaVisibile(false);
  };

  const handleRemoveFile = (file) => {
    setValue(
      "files",
      getValues("files").filter((x) => x !== file)
    );
  };

  const handleNotaUpdate = () => {
    aggiorna();
    handleCloseDialogModificaNota();
  };

  const submitForm = (values) => {
    setAggiungiNotaLoading(true);
    const formData = new FormData();
    values.files.forEach((file) => {
      formData.append("files", file);
    });
    formData.append("descrizione", values.descrizione);
    formData.append("idReclamo", router.query.slug);
    instance
      .post(getApiUrl() + "api/reclamo/nota", formData)
      .then((response) => {
        mandaNotifica("Nota creata con successo", "success");
        reset({ descrizione: "", files: [] });
        setAggiungiNotaLoading(false);
        aggiorna();
      })
      .catch((error) => {
        mandaNotifica("Impossibile creare la nota", "error");
        setAggiungiNotaLoading(false);
      });
  };

  const handleDownloadFile = (file) => {
    axios({
      url: getApiUrl() + "api/reclamo/downloadFileNota?id=" + file.id,
      method: "GET",
      responseType: "blob",
    }).then((response) => {
      // create file link in browser's memory
      const href = URL.createObjectURL(response.data);

      // create "a" HTML element with href to file & click
      const link = document.createElement("a");
      link.href = href;
      link.setAttribute("download", file.filename); //or any other extension
      document.body.appendChild(link);
      link.click();

      // clean up "a" element & remove ObjectURL
      document.body.removeChild(link);
      URL.revokeObjectURL(href);
    });
  };

  const aggiorna = () => {
    mutate();
  };

  const eliminaNota = (nota) => {
    instance
      .post(getApiUrl() + "api/reclamo/deleteNota?id=" + nota.id)
      .then(() => {
        mandaNotifica("Nota eliminata con successo", "success");
        aggiorna();
      })
      .catch(() => mandaNotifica("Impossibile cancellare la nota", "error"));
  };

  const handleModificaNotaClick = (nota) => {
    setSelectedNota(nota);
    handleOpenDialogModificaNota(true);
  };

  const display = (obj) => {
    return (
      <Card key={obj.id}>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Ultima modifica il{" "}
            {dayjs(obj.timestamp).format("DD/MM/YYYY [alle] HH:mm:ss")} da{" "}
            {obj.nome + " " + obj.cognome}
          </Typography>
          <Box sx={{ flexWrap: "wrap" }}>
            {obj.fileList.map((f) => (
              <Tooltip title="Download">
                <Chip
                  label={f.filename}
                  sx={{ margin: 0.5 }}
                  onClick={() => handleDownloadFile(f)}
                  onDelete={() => handleDownloadFile(f)}
                  deleteIcon={<DownloadIcon />}
                />
              </Tooltip>
            ))}
          </Box>
          <Typography variant="h5" component="div">
            {obj.descrizione}
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            size="small"
            color="warning"
            onClick={() => handleModificaNotaClick(obj)}
          >
            Modifica
          </Button>
          <Button size="small" color="error" onClick={() => eliminaNota(obj)}>
            Elimina
          </Button>
        </CardActions>
      </Card>
    );
  };

  return (
    <Stack direction={"column"} spacing={1} p={1}>
      <Paper>
        <Stack
          direction={"column"}
          p={1}
          component="form"
          noValidate
          onSubmit={handleSubmit(submitForm)}
        >
          <Typography variant="button">Gestisci note</Typography>
          <Stack direction={"row"} spacing={1} p={1}>
            {aggiungiNotaVisibile ? (
              <>
                <Button
                  variant="outlined"
                  type="submit"
                  color="error"
                  startIcon={<CloseIcon />}
                  onClick={() => chiudiSezioneSalvataggio()}
                >
                  Chiudi
                </Button>
                <LoadingButton
                  variant="contained"
                  type="submit"
                  startIcon={<SaveIcon />}
                  disabled={watch("descrizione") === ""}
                  loading={aggiungiNotaLoading}
                >
                  Salva
                </LoadingButton>
              </>
            ) : (
              <Button
                variant="contained"
                onClick={() => setAggiungiNotaVisibile(true)}
                startIcon={<AddIcon />}
              >
                Aggiungi nota
              </Button>
            )}
          </Stack>
          {aggiungiNotaVisibile ? (
            <Stack direction={"column"} spacing={1}>
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
                maxRows={4}
                autoFocus
              />
              <Box sx={{ flexWrap: "wrap" }}>
                {watch("files").map((f) => (
                  <Chip
                    label={f.name}
                    onDelete={() => handleRemoveFile(f)}
                    sx={{ margin: 0.5 }}
                  />
                ))}
              </Box>
              <MyDropzone callback={onFileLoaded} />
            </Stack>
          ) : (
            <></>
          )}
        </Stack>
      </Paper>
      {list === undefined ? (
        <CircularProgress />
      ) : (
        <Stack direction={"column"} spacing={0.5}>
          {list.map((obj) => display(obj))}
        </Stack>
      )}
      <DialogModificaNota
        opened={dialogModificaNotaOpened}
        handleClose={handleCloseDialogModificaNota}
        handleOnSubmit={handleNotaUpdate}
        nota={selectedNota}
      />
    </Stack>
  );
}

Page.getLayout = function getLayout(page) {
  return <ReclamoNestedLayout>{page}</ReclamoNestedLayout>;
};
