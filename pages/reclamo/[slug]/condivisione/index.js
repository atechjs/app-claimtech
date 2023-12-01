import React, { useEffect, useState } from "react";
import ReclamoNestedLayout from "../../../../components/reclamo/reclamoNestedLayout";
import useReclamoCondivisione from "../../../../components/fetching/useReclamoCondivisione";
import { useRouter } from "next/router";
import {
  Button,
  Paper,
  Stack,
  Typography,
  CircularProgress,
} from "@mui/material";
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
import Select from "react-select";
import usePermessiReclamoUtente from "../../../../components/fetching/usePermessiReclamoUtente";

export default function Page() {
  const router = useRouter();
  const instance = GetCurrentAxiosInstance();

  const modificaOptions = [
    { label: "SI", value: true },
    { label: "NO", value: false },
  ];

  const onDataCaricata = (data) => {
    setList(data);
  };
  const { data, mutate } = useReclamoCondivisione(
    router.query.slug,
    onDataCaricata
  );

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
  const [list, setList] = useState(undefined);

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
  };

  const onSalva = () => {
    instance
      .post(getApiUrl() + "api/reclamo/updateCondivisione", {
        id: router.query.slug,
        utenteList: list,
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

  const onSelectChange = (utente, selected) => {
    const newValue = !selected || selected == null ? null : selected.value;
    setList(
      list.map((ut) =>
        ut.idUtente !== utente.idUtente ? ut : { ...utente, modifica: newValue }
      )
    );
  };

  if (!list || !permessiReclamoUtente) return <CircularProgress />;
  return (
    <Stack direction={"column"} spacing={1} p={1}>
      <Paper sx={{ p: 1 }}>
        <Typography variant="button">Gestisci condivisioni</Typography>
        <Stack direction={"row"} spacing={1}>
          <Button
            variant="contained"
            onClick={() => onSalva()}
            disabled={!permessiReclamoUtente.modifica}
          >
            Salva
          </Button>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialogCondivisione()}
          >
            Nuova
          </Button>
        </Stack>
      </Paper>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Cognome</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Può modificare?</TableCell>
              <TableCell>Azione</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list.map((l, index) => (
              <TableRow key={l.idUtente}>
                <TableCell>{l.nome}</TableCell>
                <TableCell>{l.cognome}</TableCell>
                <TableCell>{l.username}</TableCell>
                <TableCell>
                  {
                    <Select
                      options={modificaOptions}
                      onChange={(e) => onSelectChange(l, e)}
                      autosize={true}
                      menuPortalTarget={document.body}
                      menuPosition={"fixed"}
                      value={
                        modificaOptions.find(
                          (option) => option.value === l.modifica
                        ) || null
                      }
                      isDisabled={
                        index === 0 || !permessiReclamoUtente.modifica
                      }
                    />
                  }
                </TableCell>
                <TableCell>
                  {l.cancellabile ? (
                    <Button
                      onClick={() => rimuovi(l.idUtente)}
                      color="error"
                      variant="outlined"
                      startIcon={<RemoveIcon />}
                      disabled={!permessiReclamoUtente.modifica}
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
