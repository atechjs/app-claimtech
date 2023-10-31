import React, { useState } from "react";
import ReclamoNestedLayout from "../../../../components/reclamo/reclamoNestedLayout";
import useReclamoCondivisione from "../../../../components/fetching/useReclamoCondivisione";
import { useRouter } from "next/router";
import { Button, Paper, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { getTraduzioneTabella } from "../../../../components/my-mui-data-table/traduzioneTabella";
import MUIDataTable from "mui-datatables";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import RemoveIcon from "@mui/icons-material/Remove";
import GetCurrentAxiosInstance from "../../../../utils/Axios";
import getApiUrl from "../../../../utils/BeUrl";
import { mandaNotifica } from "../../../../utils/ToastUtils";
import DialogCondivisioneUtenti from "../../../../components/condivisioneUtente/DialogCondivisioneUtenti";

export default function Page() {
  const router = useRouter();
  const instance = GetCurrentAxiosInstance();

  const onDataCaricata = (data) => {
    setList(data);
  };
  const { data, mutate } = useReclamoCondivisione(
    router.query.slug,
    onDataCaricata
  );
  const [list, setList] = useState(undefined);
  const [salva, setSalva] = useState(false);

  const [dialogCondivisioneOpended, setDialogCondivisioneOpened] =
    useState(false);

  const handleOpenDialogCondivisione = () => setDialogCondivisioneOpened(true);
  const handleCloseDialogCondivisione = () =>
    setDialogCondivisioneOpened(false);

  const handleSubmitDialogCondivisione = (values) => {
    instance
      .post(getApiUrl() + "api/reclamo/condividi", {
        idReclamoList: [router.query.slug],
        idUtenteList: values.map((utente) => utente.id),
      })
      .then(() => {
        mutate();
        mandaNotifica("Reclamo condiviso correttamente", "success");
        handleCloseDialogCondivisione();
      })
      .catch(() =>
        mandaNotifica("Non è stato possibile condividere il reclamo", "error")
      );
  };

  const rimuovi = (id) => {
    setList(list.filter((x) => x.idUtente !== id));
    setSalva(true);
  };

  const onSalva = () => {
    instance
      .post(getApiUrl() + "api/reclamo/updateCondivisione", {
        id: router.query.slug,
        idUtenteList: list.map((x) => x.idUtente),
      })
      .then(() =>
        mandaNotifica("Condivisione modificata con successo", "success")
      )
      .catch(() =>
        mandaNotifica(
          "Non è stato possibile modificare la condivisione",
          "error"
        )
      );
  };

  if (!list) return;
  return (
    <Stack direction={"column"} spacing={1} p={1}>
      <Paper sx={{ p: 1 }}>
        <Typography variant="button">Gestisci condivisioni</Typography>
        <Stack direction={"row"} spacing={1}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialogCondivisione()}
          >
            Nuova
          </Button>
          {salva ? (
            <Button variant="outlined" onClick={() => onSalva()}>
              Salva
            </Button>
          ) : null}
        </Stack>
      </Paper>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Cognome</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Azione</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list.map((l) => (
              <TableRow key={l.idUtente}>
                <TableCell>{l.nome}</TableCell>
                <TableCell>{l.cognome}</TableCell>
                <TableCell>{l.username}</TableCell>
                <TableCell>
                  {l.cancellabile ? (
                    <Button
                      onClick={() => rimuovi(l.idUtente)}
                      color="error"
                      variant="outlined"
                      startIcon={<RemoveIcon />}
                    >
                      Elimina
                    </Button>
                  ) : (
                    <span>-</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <DialogCondivisioneUtenti
        opened={dialogCondivisioneOpended}
        handleClose={handleCloseDialogCondivisione}
        handleOnSubmit={handleSubmitDialogCondivisione}
      />
    </Stack>
  );
}

Page.getLayout = function getLayout(page) {
  return <ReclamoNestedLayout>{page}</ReclamoNestedLayout>;
};
