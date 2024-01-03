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
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import AddIcon from "@mui/icons-material/Add";
import getApiUrl from "../../../../utils/BeUrl";
import GetCurrentAxiosInstance from "../../../../utils/Axios";
import { mandaNotifica } from "../../../../utils/ToastUtils";
import DialogCreaProposta from "../../../../components/proposta/dialogCreaProposta";
import usePermessiReclamoUtente from "../../../../components/fetching/usePermessiReclamoUtente";
export default function Page() {
  const router = useRouter();
  const instance = GetCurrentAxiosInstance();

  const [dialogCreaPropostaOpened, setDialogCreaPropostaOpened] =
    useState(false);

  const handleOpenDialogCreaProposta = () => {
    setDialogCreaPropostaOpened(true);
  };

  const handleCloseDialogCreaProposta = () => {
    setDialogCreaPropostaOpened(false);
  };

  const handleOnSubmitCreaProposta = () => {};

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
      <DialogCreaProposta
        opened={dialogCreaPropostaOpened}
        handleClose={handleCloseDialogCreaProposta}
        handleOnSubmit={handleOnSubmitCreaProposta}
        idReclamoList={[router.query.slug]}
      />
    </Stack>
  );
}

Page.getLayout = function getLayout(page) {
  return <ReclamoNestedLayout>{page}</ReclamoNestedLayout>;
};
