import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import { Box } from "@mui/material";
import ModificaReso from "./modificaReso";

export default function DialogModificaReso({
  opened,
  handleClose,
  handleOnSubmit,
  reso,
}) {
  const [open, setOpen] = React.useState(opened);

  React.useEffect(() => {
    setOpen(opened);
  }, [opened]);

  const handleOnSubmitInternal = (val) => {
    handleClose();
    if (handleOnSubmit) handleOnSubmit(val);
  };

  return reso !== undefined ? (
    <Dialog open={open} onClose={handleClose}>
      <Box p={2} width={"100%"}>
        <DialogTitle>Modifica reso</DialogTitle>
        <ModificaReso reso={reso} onSubmitReso={handleOnSubmitInternal} />
      </Box>
    </Dialog>
  ) : null;
}
