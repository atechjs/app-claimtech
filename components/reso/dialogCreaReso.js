import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import { Box, Button, Stack, Typography } from "@mui/material";
import CreaReso from "./creaReso";
import useFornituraResoAutorizzato from "../fetching/useFornituraResoAutorizzato";

export default function DialogCreaReso({
  opened,
  handleClose,
  handleOnSubmit,
  idReclamoList,
}) {
  const [open, setOpen] = React.useState(opened);
  const { data: dataList } = useFornituraResoAutorizzato(idReclamoList);

  React.useEffect(() => {
    setOpen(opened);
  }, [opened]);

  const handleOnBack = () => {
    handleClose();
  };

  const onSubmit = (data) => {
    handleOnSubmit(data);
  };

  if (dataList === undefined || dataList.length === 0)
    return (
      <Dialog open={open} onClose={handleClose}>
        <Box p={2} width={"100%"}>
          <Typography m={4}>
            Nessuna fornitura autorizzata per il reso
          </Typography>
        </Box>
      </Dialog>
    );

  return (
    <Dialog open={open} onClose={handleClose} fullScreen>
      <Box p={2} width={"100%"}>
        <Stack direction={"row"} width={"100%"}>
          <DialogTitle>Nuovo reso</DialogTitle>
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
        <CreaReso dataList={dataList} onSubmit={onSubmit} />
      </Box>
    </Dialog>
  );
}
