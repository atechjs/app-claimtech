import * as React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useAllUtenti from "../fetching/useAllUtenti";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TabDialogCondivisioneUtenti from "./TabDialogCondivisioneUtenti";
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
