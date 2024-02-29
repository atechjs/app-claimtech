import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import CondivisioneUtente from "./CondivisioneUtente";

export default function DialogCondivisioneUtenti({
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
      <DialogTitle>Condividi con altri utenti</DialogTitle>
      <CondivisioneUtente onSubmit={handleOnSubmit} onBack={handleOnBack} />
    </Dialog>
  );
}
