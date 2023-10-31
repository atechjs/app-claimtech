import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import { Box, Button, Stack, Typography } from "@mui/material";
import DownloadReportReclami from "./downloadReportReclami";

export default function DialogDownloadReportReclami({
  opened,
  handleClose,
  idReclamoList,
}) {
  const [open, setOpen] = React.useState(opened);
  React.useEffect(() => {
    setOpen(opened);
  }, [opened]);

  return (
    <Dialog open={open} onClose={handleClose}>
      <Box p={2} width={"100%"}>
        <Stack direction={"row"} width={"100%"}>
          <DialogTitle>Genera report reclami</DialogTitle>
        </Stack>
        <DownloadReportReclami
          idReclamoList={idReclamoList}
          handleClose={handleClose}
        />
      </Box>
    </Dialog>
  );
}
