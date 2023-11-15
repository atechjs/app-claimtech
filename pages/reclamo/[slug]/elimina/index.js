import React from "react";
import ReclamoNestedLayout from "../../../../components/reclamo/reclamoNestedLayout";
import { Alert, AlertTitle, Button, Paper, Stack } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import GetCurrentAxiosInstance from "../../../../utils/Axios";
import getApiUrl from "../../../../utils/BeUrl";
import { useRouter } from "next/router";
import { mandaNotifica } from "../../../../utils/ToastUtils";
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
  return (
    <Stack direction={"column"} spacing={1} p={1}>
      <Paper>
        <Stack p={1} spacing={1}>
          <Alert severity="warning">
            <AlertTitle>Eliminazione reclamo</AlertTitle>
            Premendo il pulsante <strong>elimina</strong> cancellerai tutti i
            dati associati al reclamo.
            <strong> L'operazione è irreversibile</strong>
          </Alert>
          <Stack direction={"row"}>
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => eliminaReclamo()}
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
