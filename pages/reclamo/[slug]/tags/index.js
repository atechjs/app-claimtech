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
import DialogAssegnaTag from "../../../../components/assegnaTag/dialogAssegnaTag";
import useReclamoTags from "../../../../components/fetching/useReclamoTags";

export default function Page() {
  const router = useRouter();
  const instance = GetCurrentAxiosInstance();

  const onDataCaricata = (data) => {
    setList(data);
  };
  const { data, mutate } = useReclamoTags(router.query.slug, onDataCaricata);
  const [list, setList] = useState(undefined);
  const [salva, setSalva] = useState(false);

  const [dialogAssociaTagsOpened, setDialogAssociaTagsOpened] = useState(false);

  const handleOpenDialogAssociaTags = () => setDialogAssociaTagsOpened(true);
  const handleCloseDialogAssociaTags = () => setDialogAssociaTagsOpened(false);

  const handleSubmitDialogAssociaTags = (values) => {
    console.log("values", values);
    instance
      .post(getApiUrl() + "api/reclamo/associaTag", {
        idReclamoList: [router.query.slug],
        tags: values.tags,
        assegna: values.assegna,
      })
      .then(() => {
        mutate();
        mandaNotifica("Tag associati correttamente", "success");
        handleCloseDialogAssociaTags();
      })
      .catch(() =>
        mandaNotifica("Non è stato possibile associare i tag", "error")
      );
  };

  const rimuovi = (id) => {
    setList(list.filter((x) => x.id !== id));
    setSalva(true);
  };

  const onSalva = () => {
    instance
      .post(getApiUrl() + "api/reclamo/updateTags", {
        id: router.query.slug,
        idTagList: list.map((x) => x.id),
      })
      .then(() => mandaNotifica("Tag aggiornati con successo", "success"))
      .catch(() =>
        mandaNotifica("Non è stato possibile aggiornare i tag", "error")
      );
  };

  if (!list) return;
  return (
    <Stack direction={"column"} spacing={1} p={1}>
      <Paper sx={{ p: 1 }}>
        <Typography variant="button">Gestisci i tags</Typography>
        <Stack direction={"row"} spacing={1}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialogAssociaTags()}
          >
            Nuovo
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
              <TableCell>Tag</TableCell>
              <TableCell>Azione</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list.map((l) => (
              <TableRow key={l.id}>
                <TableCell>{l.descrizione}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => rimuovi(l.id)}
                    color="error"
                    variant="outlined"
                    startIcon={<RemoveIcon />}
                  >
                    Elimina
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <DialogAssegnaTag
        opened={dialogAssociaTagsOpened}
        handleClose={handleCloseDialogAssociaTags}
        handleOnSubmit={handleSubmitDialogAssociaTags}
      />
    </Stack>
  );
}

Page.getLayout = function getLayout(page) {
  return <ReclamoNestedLayout>{page}</ReclamoNestedLayout>;
};
