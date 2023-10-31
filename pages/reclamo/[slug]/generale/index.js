import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Divider,
  FormControlLabel,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import React, { useState } from "react";
import ReclamoNestedLayout from "../../../../components/reclamo/reclamoNestedLayout";
import Layout from "../../../../components/layout";
import Grid from "@mui/material/Grid";
import useReclamoGenerale from "../../../../components/fetching/useReclamoGenerale";
import dayjs from "dayjs";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Controller, useForm } from "react-hook-form";
import GetCurrentAxiosInstance from "../../../../utils/Axios";
import getApiUrl from "../../../../utils/BeUrl";
import { mandaNotifica } from "../../../../utils/ToastUtils";
import LabelInfo from "../../../../components/reclamo/LabelInfo";

export default function Page() {
  const router = useRouter();
  const [modifica, setModifica] = useState(false);
  const instance = GetCurrentAxiosInstance();

  const { data, mutate } = useReclamoGenerale(router.query.slug);
  const form = useForm({
    defaultValues: {
      codiceClienteReclamo: "",
      includiRateo: false,
      noteGenerali: "",
    },
  });
  const { register, handleSubmit, formState, reset, control, getValues } = form;

  const abilitaModifica = () => {
    setModifica(true);
    reset(data);
  };

  const salvaModifiche = () => {
    instance
      .post(getApiUrl() + "api/reclamo/updateGenerale", getValues())
      .then(() => {
        mandaNotifica("Reclamo aggiornato correttamente", "success");
        setModifica(false);
        mutate();
      })
      .catch(() => mandaNotifica("Impossibile aggiornare il reclamo", "error"));
  };

  const displayUtente = (utente) => {
    return (
      <Chip
        size="small"
        avatar={
          <Avatar>
            {utente.username.length >= 2
              ? utente.username.charAt(0) + utente.username.charAt(1)
              : utente.username}
          </Avatar>
        }
        label={utente.nome + " " + utente.cognome}
      />
    );
  };

  const displayAltriUtenti = (utenteList) => {
    if (utenteList.length === 0) return;
    return (
      <Stack direction={"column"} alignItems="flex-start">
        <Typography>Altri utenti:</Typography>
        <Stack
          direction={"column"}
          spacing={0.5}
          justifyContent="center"
          alignItems="flex-start"
        >
          {utenteList.map((utente) => displayUtente(utente))}
        </Stack>
      </Stack>
    );
  };

  if (data === undefined) return <CircularProgress />;
  return (
    <Box p={1}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={8} md={10}>
          <Paper square sx={{ width: "100%" }}>
            <Stack direction={"column"} spacing={0}>
              <Accordion defaultExpanded>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography>DATI GENERALI</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack direction={"column"} divider={<Divider />} spacing={1}>
                    <Stack direction={"row"} spacing={2}>
                      <LabelInfo
                        label="Tipologia reclamo"
                        value={data.codiceTipologiaReclamo}
                      />
                      <LabelInfo label="Numero" value={data.numero} />
                      <LabelInfo
                        label="Creato il"
                        value={dayjs(data.timestampCreazione).format(
                          "DD/MM/YYYY [alle] HH:mm:ss"
                        )}
                      />
                      {data.timestampChiusura ? (
                        <LabelInfo
                          label="Chiuso il"
                          value={dayjs(data.timestampChiusura).format(
                            "DD/MM/YYYY [alle] HH:mm:ss"
                          )}
                        />
                      ) : (
                        <></>
                      )}

                      <LabelInfo label="Fase" value={data.codiceFase} />
                    </Stack>
                    <Stack direction={"row"} spacing={2}>
                      {!modifica ? (
                        <LabelInfo
                          label="Codice cliente reclamo"
                          value={data.codiceClienteReclamo}
                        />
                      ) : (
                        <TextField
                          {...register("codiceClienteReclamo")}
                          size="small"
                          margin="normal"
                          id="codiceClienteReclamo"
                          label="Codice cliente reclamo"
                          name="codiceClienteReclamo"
                        />
                      )}
                    </Stack>
                    <Stack direction={"row"} spacing={2}>
                      <LabelInfo
                        label="Stabilimento"
                        value={
                          data.codiceStabilimento +
                          " - " +
                          data.descrizioneStabilimento
                        }
                      />
                    </Stack>
                    <Stack direction={"row"} spacing={2}>
                      <LabelInfo label="Form" value={data.codiceForm} />
                      <LabelInfo
                        label="Versione Form"
                        value={data.versioneForm}
                      />
                    </Stack>
                    <LabelInfo label="Valuta" value={data.codiceValuta} />
                    {!modifica ? (
                      <LabelInfo
                        label="Includi nel rateo"
                        value={data.includiRateo ? "SI" : "NO"}
                      />
                    ) : (
                      <Controller
                        control={control}
                        name={"includiRateo"}
                        render={({ field: { onChange, value } }) => (
                          <FormControlLabel
                            control={
                              <Checkbox checked={value} onChange={onChange} />
                            }
                            label="Includi nel rateo"
                          />
                        )}
                      />
                    )}
                    {!modifica ? (
                      <LabelInfo
                        label="Note generali"
                        value={data.noteGenerali}
                      />
                    ) : (
                      <TextField
                        {...register("noteGenerali")}
                        size="small"
                        margin="normal"
                        id="noteGenerali"
                        label="Note generali"
                        name="noteGenerali"
                        multiline
                        minRows={4}
                      />
                    )}
                    <Stack direction={"row"}>
                      {!modifica ? (
                        <Button
                          variant="outlined"
                          color="warning"
                          onClick={() => abilitaModifica()}
                        >
                          Modifica
                        </Button>
                      ) : (
                        <Button
                          variant="outlined"
                          color="success"
                          type="submit"
                          onClick={() => salvaModifiche()}
                        >
                          Salva
                        </Button>
                      )}
                    </Stack>
                  </Stack>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography>DATI CLIENTE</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack direction={"column"} spacing={1}>
                    <LabelInfo label="Codice" value={data.codiceCliente} />
                    <LabelInfo
                      label="Descrizione"
                      value={data.descrizioneCliente}
                    />
                  </Stack>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography>DATI VALORIZZAZIONE</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack direction={"column"} spacing={1}>
                    <LabelInfo
                      label={"In valuta(" + data.codiceValuta + ")"}
                      value={data.valorizzazioneValuta}
                    />
                    <LabelInfo
                      label={"In EURO"}
                      value={data.valorizzazioneEuro}
                    />
                  </Stack>
                </AccordionDetails>
              </Accordion>
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4} md={2}>
          <Paper square sx={{ p: 2 }}>
            <Typography>Assegnato a:</Typography>
            {displayUtente(data.utenteList[0])}
            {displayAltriUtenti(
              data.utenteList.length > 1 ? data.utenteList.slice(1) : []
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

Page.getLayout = function getLayout(page) {
  return <ReclamoNestedLayout>{page}</ReclamoNestedLayout>;
};
