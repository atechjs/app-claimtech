import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import ModificaRateo from "./modificaRateo";

export default function DialogModificaRateo({
  opened,
  handleClose,
  handleOnSubmit,
}) {
  const [open, setOpen] = React.useState(opened);

  React.useEffect(() => {
    setOpen(opened);
  }, [opened]);

  const handleOnBack = () => {
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>Modifica rateo</DialogTitle>
      <ModificaRateo onSubmit={handleOnSubmit} onBack={handleOnBack} />
    </Dialog>
  );
}
