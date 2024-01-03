import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import { Box, Button, Stack, Typography } from "@mui/material";
import useFornituraPropostaAutorizzata from "../fetching/useFornituraPropostaAutorizzata";
import CreaProposta from "./creaProposta";

export default function DialogCreaProposta({
  opened,
  handleClose,
  handleOnSubmit,
  idReclamoList,
}) {
  const [open, setOpen] = React.useState(opened);
  const { data: dataList } = useFornituraPropostaAutorizzata(idReclamoList);

  React.useEffect(() => {
    setOpen(opened);
  }, [opened]);

  const onSubmit = (data) => {
    handleOnSubmit(data);
  };

  const filtraReclamiNonVuoti = (dataList) => {
    if (dataList === undefined || dataList.length === 0) return [];
    return dataList.filter(
      (data) => data.fornituraCausaReclamoList.length !== 0
    );
  };

  if (
    dataList === undefined ||
    dataList.length === 0 ||
    filtraReclamiNonVuoti(dataList).length === 0
  )
    return (
      <Dialog open={open} onClose={handleClose}>
        <Box p={2} width={"100%"}>
          <Typography m={4}>
            Nessuna fornitura utilizzabile per creare la proposta
          </Typography>
        </Box>
      </Dialog>
    );

  return (
    <Dialog open={open} onClose={handleClose} fullScreen>
      <Box p={2} width={"100%"}>
        <Stack direction={"row"} width={"100%"} pb={1}>
          <DialogTitle>Nuova proposta</DialogTitle>
          <Stack
            direction="row-reverse"
            justifyContent="flex-end"
            width={"100%"}
          >
            <Button
              color="error"
              variant="outlined"
              size="small"
              onClick={() => handleClose()}
            >
              Annulla
            </Button>
          </Stack>
        </Stack>
        <CreaProposta
          dataList={filtraReclamiNonVuoti(dataList)}
          onSubmit={onSubmit}
        />
      </Box>
    </Dialog>
  );
}
