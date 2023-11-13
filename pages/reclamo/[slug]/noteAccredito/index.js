import React, { useState } from "react";
import ReclamoNestedLayout from "../../../../components/reclamo/reclamoNestedLayout";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import UseReclamoNoteAccredito from "../../../../components/fetching/useReclamoNoteAccredito";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AddIcon from "@mui/icons-material/Add";
import dayjs from "dayjs";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import EuroIcon from "@mui/icons-material/Euro";
import DialogCreaNotaAccredito from "../../../../components/creaNotaAccredito/dialogCreaNotaAccredito";
import getApiUrl from "../../../../utils/BeUrl";
import GetCurrentAxiosInstance from "../../../../utils/Axios";
import { mandaNotifica } from "../../../../utils/ToastUtils";
export default function Page() {
  const router = useRouter();
  const instance = GetCurrentAxiosInstance();
  const { data, mutate } = UseReclamoNoteAccredito(router.query.slug);
  const [dialogCreaNotaAccreditoOpened, setDialogCreaNotaAccreditoOpened] =
    useState(false);

  const handleOpenDialogCreaNotaAccredito = () => {
    setDialogCreaNotaAccreditoOpened(true);
  };

  const handleCloseDialogCreaNotaAccredito = () => {
    setDialogCreaNotaAccreditoOpened(false);
  };

  const handleOnSubmitCreaNotaAccredito = (values) => {
    //TODO DA MODIFICARE
    values = {
      ...values,
      idFornituraCausaReclamoList: values.idFornituraCausaReclamoList.map(
        (x) => x.id
      ),
    };
    instance
      .post(getApiUrl() + "api/reclamo/nuovaNotaAccredito", values)
      .then(() => {
        mandaNotifica("Nota accredito salvata con successo", "success");
        mutate();
        handleCloseDialogCreaNotaAccredito();
      })
      .catch(() =>
        mandaNotifica(
          "Non è stato possibile salvare la nota accredito",
          "error"
        )
      );
  };

  const displayNotaAccredito = (notaAccredito) => {
    return (
      <Grid item key={notaAccredito.id} xs={6} sm={6} md={3}>
        <Card>
          <CardContent>
            <Stack
              direction={"row"}
              justifyContent="flex-start"
              alignItems="center"
              spacing={1}
            >
              <CalendarMonthIcon fontSize="14" />
              <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
              >
                {dayjs(notaAccredito.data).format("DD/MM/YYYY")}
              </Typography>
            </Stack>
            <Typography variant="h5" component="div">
              {notaAccredito.codice}
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              {notaAccredito.tipo +
                " " +
                notaAccredito.anno +
                " " +
                notaAccredito.codice}
            </Typography>
            <Stack direction={"row"} spacing={1} pb={1}>
              <Stack
                direction={"row"}
                justifyContent="flex-start"
                alignItems="center"
                spacing={2}
              >
                <RequestQuoteIcon fontSize="14" />
                <Typography variant="body2">
                  Valore valuta: <b>{notaAccredito.valoreValuta}</b>
                </Typography>
              </Stack>
              <Stack
                direction={"row"}
                justifyContent="flex-start"
                alignItems="center"
                spacing={1}
              >
                <EuroIcon fontSize="14" />
                <Typography variant="body2">
                  Valore euro: <b>{notaAccredito.valoreEuro}</b>
                </Typography>
              </Stack>
            </Stack>
            <Divider />
            <Typography variant="header" sx={{ pt: 1 }}>
              Fornitura associata:
            </Typography>
            <Stack direction={"column"} divider={<Divider />} spacing={1}>
              {notaAccredito.fornituraCausaReclamoList.map((fornitura) => (
                <Stack direction={"column"} key={fornitura.id}>
                  <Typography>
                    Codice: <b>{fornitura.codice}</b>
                  </Typography>
                  <Typography>
                    Codice cliente: <b>{fornitura.codicePartitaCliente}</b>
                  </Typography>
                  <Typography>
                    Causa: <b>{fornitura.codiceCausa}</b>
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    );
  };

  return data ? (
    <Stack direction={"column"} spacing={1} p={1}>
      <Paper sx={{ p: 1 }}>
        <Typography variant="button">Gestisci note accredito</Typography>
        <Stack direction={"row"} spacing={1}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialogCreaNotaAccredito()}
          >
            Nuova
          </Button>
        </Stack>
      </Paper>
      <Grid
        spacing={2}
        justifyContent="flex-start"
        alignItems="stretch"
        width={"100%"}
        container
        pr={2}
      >
        {data.map((notaAccredito) => displayNotaAccredito(notaAccredito))}
      </Grid>
      <DialogCreaNotaAccredito
        opened={dialogCreaNotaAccreditoOpened}
        handleClose={handleCloseDialogCreaNotaAccredito}
        handleOnSubmit={handleOnSubmitCreaNotaAccredito}
        idReclamoList={[router.query.slug]}
      />
    </Stack>
  ) : (
    <CircularProgress />
  );
}

Page.getLayout = function getLayout(page) {
  return <ReclamoNestedLayout>{page}</ReclamoNestedLayout>;
};
