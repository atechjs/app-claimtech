import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import AssegnaTag from "./assegnaTag";

export default function DialogAssegnaTag({
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
      <DialogTitle>Assegna tag</DialogTitle>
      <AssegnaTag onSubmit={handleOnSubmit} onBack={handleOnBack} />
    </Dialog>
  );
}
