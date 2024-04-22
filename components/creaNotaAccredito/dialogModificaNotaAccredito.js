import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import { Box } from "@mui/material";
import ModificaNotaAccredito from "./modificaNotaAccredito";

export default function DialogModificaNotaAccredito({
  opened,
  handleClose,
  handleOnSubmit,
  notaAccredito,
}) {
  const [open, setOpen] = React.useState(opened);

  React.useEffect(() => {
    setOpen(opened);
  }, [opened]);

  const handleOnSubmitInternal = (val) => {
    handleClose();
    if (handleOnSubmit) handleOnSubmit(val);
  };

  return notaAccredito !== undefined ? (
    <Dialog open={open} onClose={handleClose}>
      <Box p={2} width={"100%"}>
        <DialogTitle>Modifica nota accredito</DialogTitle>
        <ModificaNotaAccredito
          notaAccredito={notaAccredito}
          onSubmitNotaAccredito={handleOnSubmitInternal}
        />
      </Box>
    </Dialog>
  ) : null;
}
