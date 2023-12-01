import React, { useEffect, useState } from "react";
import ReclamoNestedLayout from "../../../../components/reclamo/reclamoNestedLayout";
import {
  Alert,
  AlertTitle,
  Button,
  Paper,
  Stack,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import GetCurrentAxiosInstance from "../../../../utils/Axios";
import getApiUrl from "../../../../utils/BeUrl";
import { useRouter } from "next/router";
import { mandaNotifica } from "../../../../utils/ToastUtils";
import usePermessiReclamoUtente from "../../../../components/fetching/usePermessiReclamoUtente";
export default function Page() {
  const router = useRouter();
  const instance = GetCurrentAxiosInstance();

  const eliminaReclamo = () => {
    instance
      .post(getApiUrl() + "api/reclamo/delete?id=" + router.query.slug)
      .then((response) => router.replace("/reclamiAssegnati"))
      .catch((error) =>
        mandaNotifica("Impossibile cancellare il reclamo", "error")
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
      <Paper>
        <Stack p={1} spacing={1}>
          {permessiReclamoUtente.modifica ? (
            <Alert severity="warning">
              <AlertTitle>Eliminazione reclamo</AlertTitle>
              Premendo il pulsante <strong>elimina</strong> cancellerai tutti i
              dati associati al reclamo.
              <strong> L'operazione è irreversibile</strong>
            </Alert>
          ) : (
            <Alert severity="info">
              <AlertTitle>Eliminazione reclamo</AlertTitle>
              Non hai i permessi per eliminare il reclamo
            </Alert>
          )}
          <Stack direction={"row"}>
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => eliminaReclamo()}
              disabled={!permessiReclamoUtente.modifica}
            >
              Elimina
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  );
}

Page.getLayout = function getLayout(page) {
  return <ReclamoNestedLayout>{page}</ReclamoNestedLayout>;
};
