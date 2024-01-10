import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import usePropostaById from "../fetching/usePropostaById";
import LabelInformazione from "../reclamo/labelInformazione";
import dayjs from "dayjs";
import OpenInBrowserIcon from "@mui/icons-material/OpenInBrowser";
import CloseIcon from "@mui/icons-material/Close";
import { useRouter } from "next/router";
import TabellaProposta from "./tabellaProposta";
import { index } from "mathjs";
import useWorkflowGestioneReclamoSelect from "../fetching/useWorkflowGestioneReclamoSelect";
import DialogInfoStato from "./dialogInfoStato";
import ApplicaATuttiProposta from "./applicaATuttiProposta";
import GetCurrentAxiosInstance from "../../utils/Axios";
import getApiUrl from "../../utils/BeUrl";
import { mandaNotifica } from "../../utils/ToastUtils";

export default function DialogModificaProposta({
  opened,
  handleClose,
  handleOnSubmit,
  idProposta,
  soloVisualizzazione = true,
  includiDatiReclamo = false,
  titolo = "Modifica proposta",
}) {
  const [open, setOpen] = React.useState(opened);
  const instance = GetCurrentAxiosInstance();
  const [
    propostaFornituraCausaReclamoList,
    setPropostaFornituraCausaReclamoList,
  ] = useState(undefined);

  const inizializza = (values) => {
    setPropostaFornituraCausaReclamoList(
      values.propostaFornituraCausaReclamoList
    );
  };
  const { data, isLoading, trigger } = usePropostaById(
    { id: idProposta },
    inizializza
  );
  const { workflowGestioneReclamoList } = useWorkflowGestioneReclamoSelect();
  const router = useRouter();

  React.useEffect(() => {
    setOpen(opened);
    if (opened) trigger({ id: idProposta }, inizializza);
  }, [opened]);

  const onSubmit = () => {
    console.log(
      "propostaFornituraCausaReclamoList",
      propostaFornituraCausaReclamoList
    );
    instance
      .post(getApiUrl() + "api/reclamo/updateProposta", {
        id: idProposta,
        propostaFornituraCausaReclamoList: propostaFornituraCausaReclamoList,
      })
      .then((response) => {
        mandaNotifica("Modifica salvata correttamente", "success");
        handleOnSubmit();
      });
  };

  const [selectedStatoList, setSelectedStatoList] = useState(undefined);

  if (!idProposta) return null;

  const sx = {
    "& .MuiDialog-container": {
      alignItems: "flex-start",
    },
  };

  const onOpenClick = (index) => {
    setPropostaFornituraCausaReclamoList((old) =>
      old.map((row, rowIndex) => {
        if (rowIndex === index)
          return {
            ...row,
            open: propostaFornituraCausaReclamoList[rowIndex].open
              ? false
              : true,
          };
        else return row;
      })
    );
  };

  const modificaAzione = (azione, index) => {
    setPropostaFornituraCausaReclamoList((old) =>
      old.map((row, rowIndex) => {
        if (rowIndex === index)
          return {
            ...row,
            azione: azione,
            idWorkflowCausaReclamoAlternativo: null,
          };
        else return row;
      })
    );
  };

  const onAccettaClick = (index) => {
    modificaAzione("ACCETTA", index);
    onWorkflowSelected(index, null);
  };

  const onModificaClick = (index) => {
    modificaAzione("MODIFICA", index);
  };
  const onWorkflowSelected = (index, id) => {
    setPropostaFornituraCausaReclamoList((old) =>
      old.map((row, rowIndex) => {
        if (rowIndex === index)
          return {
            ...row,
            idWorkflowCausaReclamoAlternativo: id,
          };
        else return row;
      })
    );
  };
  const onNotaChanged = (index, value) => {
    setPropostaFornituraCausaReclamoList((old) =>
      old.map((row, rowIndex) => {
        if (rowIndex === index)
          return {
            ...row,
            notaAlternativa: value,
          };
        else return row;
      })
    );
  };

  const onButtonInfoStatoClick = (statoList) => {
    setSelectedStatoList(statoList);
  };

  const chiudiDialogStorico = () => {
    setSelectedStatoList(undefined);
  };

  const applicaATutti = (values) => {
    setPropostaFornituraCausaReclamoList(
      propostaFornituraCausaReclamoList.map((row) => ({
        ...row,
        azione: values.azione,
        idWorkflowCausaReclamoAlternativo:
          values.azione === "MODIFICA"
            ? values.idWorkflowGestioneReclamo
            : null,
      }))
    );
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth={"xl"}
      sx={sx}
      scroll="paper"
    >
      <DialogTitle>{titolo}</DialogTitle>

      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <Divider />
      {propostaFornituraCausaReclamoList && !isLoading ? (
        <Paper sx={{ m: 1, p: 1 }}>
          <Box width={"100%"}>
            <Stack direction={"column"} width={"100%"} pb={1} spacing={1}>
              {includiDatiReclamo ? (
                <Stack direction={"row"} spacing={2}>
                  <LabelInformazione
                    label={"Numero reclamo"}
                    value={data.numeroReclamo}
                  />
                  <LabelInformazione
                    label={"Aperto il"}
                    value={dayjs(data.timestampCreazione).format("DD/MM/YYYY")}
                  />
                  <LabelInformazione
                    label={"Cliente"}
                    value={data.codiceCliente + " - " + data.descrizioneCliente}
                  />
                  <LabelInformazione
                    label={"Stabilimento"}
                    value={data.descrizioneStabilimento}
                  />
                  <LabelInformazione
                    label={"VALORE CONTESTAZIONE " + data.codiceValuta}
                    value={data.valoreContestazioneValuta}
                  />
                  {data.codiceValuta !== "EUR"}
                  <LabelInformazione
                    label={"VALORE CONTESTAZIONE EUR"}
                    value={data.valoreContestazioneEuro}
                  />
                  <Button
                    variant="outlined"
                    startIcon={<OpenInBrowserIcon />}
                    size="small"
                    onClick={() =>
                      router.push("/reclamo/" + data.idReclamo + "/generale")
                    }
                  >
                    Apri reclamo
                  </Button>
                </Stack>
              ) : null}
              <Stack
                direction="row-reverse"
                justifyContent="flex-end"
                width={"100%"}
              ></Stack>
              <Typography variant="h6">Dati proposta</Typography>
              {data.note && data.note !== null && data.note !== "" ? (
                <TextField
                  size="small"
                  margin="normal"
                  id="note"
                  label="Note proposta"
                  name="note"
                  multiline
                  minRows={4}
                  value={data.note}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              ) : null}
              {!soloVisualizzazione ? (
                <ApplicaATuttiProposta onSubmit={applicaATutti} />
              ) : null}
              <TabellaProposta
                propostaFornituraCausaReclamoList={
                  propostaFornituraCausaReclamoList
                }
                workflowGestioneReclamoList={workflowGestioneReclamoList}
                modificaAbilitata={true}
                sottoTabella={false}
                onOpenClick={onOpenClick}
                onAccettaClick={onAccettaClick}
                onModificaClick={onModificaClick}
                onWorkflowSelected={onWorkflowSelected}
                onNotaChanged={onNotaChanged}
                codiceValuta={data.codiceValuta}
                onButtonInfoStatoClick={onButtonInfoStatoClick}
                soloVisualizzazione={soloVisualizzazione}
              />
              <Stack direction={"row-reverse"} spacing={1}>
                {!soloVisualizzazione ? (
                  <Button
                    variant="contained"
                    disabled={
                      !(
                        propostaFornituraCausaReclamoList.find(
                          (x) => !x.azione || x.azione === null
                        ) === undefined &&
                        propostaFornituraCausaReclamoList.find(
                          (x) =>
                            x.azione === "MODIFICA" &&
                            (!x.idWorkflowCausaReclamoAlternativo ||
                              x.idWorkflowCausaReclamoAlternativo === null)
                        ) === undefined
                      )
                    }
                    onClick={onSubmit}
                  >
                    Salva e chiudi
                  </Button>
                ) : null}
                <Button variant="outlined" onClick={handleClose}>
                  Annulla
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Paper>
      ) : (
        <Container maxWidth="sx">
          <CircularProgress />
        </Container>
      )}
      <DialogInfoStato
        opened={selectedStatoList !== undefined}
        handleClose={chiudiDialogStorico}
        statoList={selectedStatoList}
      />
    </Dialog>
  );
}
