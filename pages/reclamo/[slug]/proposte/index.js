import React, { useEffect, useState } from "react";
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
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import AddIcon from "@mui/icons-material/Add";
import getApiUrl from "../../../../utils/BeUrl";
import GetCurrentAxiosInstance from "../../../../utils/Axios";
import { mandaNotifica } from "../../../../utils/ToastUtils";
import DialogCreaProposta from "../../../../components/proposta/dialogCreaProposta";
import usePermessiReclamoUtente from "../../../../components/fetching/usePermessiReclamoUtente";
import UseReclamoProposte from "../../../../components/fetching/useReclamoProposte";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import dayjs from "dayjs";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import DialogModificaProposta from "../../../../components/proposta/dialogModificaProposta";
export default function Page() {
  const router = useRouter();
  const instance = GetCurrentAxiosInstance();
  const { data } = UseReclamoProposte(router.query.slug);

  const [idPropostaSelezionata, setIdPropostaSelezionata] = useState(undefined);

  const [dialogCreaPropostaOpened, setDialogCreaPropostaOpened] =
    useState(false);

  const handleOpenDialogCreaProposta = () => {
    setDialogCreaPropostaOpened(true);
  };

  const handleCloseDialogCreaProposta = () => {
    setDialogCreaPropostaOpened(false);
  };

  const handleOnSubmitCreaProposta = () => {
    handleCloseDialogCreaProposta();
  };

  const chiudiDialogModificaProposta = () => {
    setIdPropostaSelezionata(undefined);
  };

  const displayProposta = (proposta) => {
    return (
      <Grid item key={proposta.id} xs={6} sm={6} md={3}>
        <Card>
          <CardContent>
            <Stack
              direction={"row"}
              justifyContent="space-between"
              alignItems="center"
              spacing={2}
            >
              <Stack
                direction={"row"}
                spacing={1}
                justifyContent="flex-start"
                alignItems="center"
              >
                <CalendarMonthIcon fontSize="14" />
                <Stack direction={"column"}>
                  <Typography sx={{ fontSize: 14 }} color="text.secondary">
                    Aperta il
                  </Typography>
                  <Typography sx={{ fontSize: 14 }} color="text.secondary">
                    <b>{dayjs(proposta.dataApertura).format("DD/MM/YYYY")}</b>
                  </Typography>
                </Stack>
              </Stack>

              <Stack
                direction={"row"}
                spacing={1}
                justifyContent="flex-start"
                alignItems="center"
              >
                <EventAvailableIcon
                  fontSize="14"
                  color={proposta.dataChiusura !== null ? "success" : "warning"}
                />
                <Stack direction={"column"}>
                  <Typography sx={{ fontSize: 14 }} color="text.secondary">
                    Chiusa il
                  </Typography>
                  <Typography sx={{ fontSize: 14 }} color="text.secondary">
                    <b>
                      {proposta.dataChiusura !== null
                        ? dayjs(proposta.dataChiusura).format("DD/MM/YYYY")
                        : "-"}
                    </b>
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
            <Stack direction={"column"} spacing={1}>
              <Typography variant="h5" component="div">
                #{proposta.id}
              </Typography>
              <Divider />
              {proposta.note !== null && proposta.note !== "" ? (
                <>
                  <TextField
                    label="Note"
                    value={proposta.note}
                    multiline
                  ></TextField>
                  <Divider />
                </>
              ) : null}
              <Button
                variant="outlined"
                onClick={() => setIdPropostaSelezionata(proposta.id)}
              >
                Apri
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    );
  };

  useEffect(() => {
    mutatePermessi();
  }, []);
  const onPermessiCaricati = (data) => {
    setPermessiReclamoUtente(data);
  };
  const { mutate: mutatePermessi } = usePermessiReclamoUtente(
    router.query.slug,
    onPermessiCaricati
  );
  const [permessiReclamoUtente, setPermessiReclamoUtente] = useState(undefined);

  if (!permessiReclamoUtente) return <CircularProgress />;
  return (
    <Stack direction={"column"} spacing={1} p={1}>
      <Paper sx={{ p: 1 }}>
        <Typography variant="button">Gestisci proposta</Typography>
        <Stack direction={"row"} spacing={1}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialogCreaProposta()}
            disabled={!permessiReclamoUtente.modifica}
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
        {data && data.map((proposta) => displayProposta(proposta))}
      </Grid>
      <DialogCreaProposta
        opened={dialogCreaPropostaOpened}
        handleClose={handleCloseDialogCreaProposta}
        handleOnSubmit={handleOnSubmitCreaProposta}
        idReclamoList={[router.query.slug]}
      />
      <DialogModificaProposta
        opened={idPropostaSelezionata !== undefined}
        handleClose={chiudiDialogModificaProposta}
        handleOnSubmit={() => {}}
        idProposta={idPropostaSelezionata}
        soloVisualizzazione
        includiDatiReclamo={false}
        titolo="Visualizza proposta"
      />
    </Stack>
  );
}

Page.getLayout = function getLayout(page) {
  return <ReclamoNestedLayout>{page}</ReclamoNestedLayout>;
};
