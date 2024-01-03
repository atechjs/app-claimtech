import React, { useState } from "react";
import ReclamoNestedLayout from "../../../../components/reclamo/reclamoNestedLayout";
import {
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
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AddIcon from "@mui/icons-material/Add";
import dayjs from "dayjs";
import DialogCreaReso from "../../../../components/reso/dialogCreaReso";
import getApiUrl from "../../../../utils/BeUrl";
import GetCurrentAxiosInstance from "../../../../utils/Axios";
import { mandaNotifica } from "../../../../utils/ToastUtils";
import useReclamoReso from "../../../../components/fetching/useReclamoReso";
export default function Page() {
  const router = useRouter();
  const instance = GetCurrentAxiosInstance();
  const { data, mutate } = useReclamoReso(router.query.slug);
  const [dialogCreaResoOpened, setDialogCreaResoOpened] = useState(false);

  const handleOpenDialogCreaReso = () => {
    setDialogCreaResoOpened(true);
  };

  const handleCloseDialogCreaReso = () => {
    setDialogCreaResoOpened(false);
  };

  const handleOnSubmitCreaReso = (values) => {
    instance
      .post(getApiUrl() + "api/reclamo/nuovoReso", values)
      .then(() => {
        mandaNotifica("Reso salvato con successo", "success");
        mutate();
        handleCloseDialogCreaReso();
      })
      .catch(() =>
        mandaNotifica("Non è stato possibile salvare il reso", "error")
      );
  };

  const displayReso = (reso) => {
    return (
      <Grid item key={reso.id} xs={6} sm={6} md={3}>
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
                {dayjs(reso.data).format("DD/MM/YYYY")}
              </Typography>
            </Stack>
            <Typography variant="h5" component="div">
              {reso.codice}
            </Typography>
            <Divider />
            <Typography variant="header" sx={{ pt: 1 }}>
              Fornitura associata:
            </Typography>
            <Stack direction={"column"} divider={<Divider />} spacing={1}>
              {reso.fornituraCausaReclamoList.map((fornitura) => (
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
                  <Typography>
                    Campo: <b>{fornitura.nomeCampo}</b>
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
        <Typography variant="button">Gestisci reso</Typography>
        <Stack direction={"row"} spacing={1}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialogCreaReso()}
          >
            Nuovo
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
        {data.map((reso) => displayReso(reso))}
      </Grid>
      <DialogCreaReso
        opened={dialogCreaResoOpened}
        handleClose={handleCloseDialogCreaReso}
        handleOnSubmit={handleOnSubmitCreaReso}
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
