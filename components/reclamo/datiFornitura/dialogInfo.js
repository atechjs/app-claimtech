import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import { Button, Stack, Typography } from "@mui/material";
import LabelInfo from "../LabelInfo";
import dayjs from "dayjs";
import DownloadIcon from "@mui/icons-material/Download";

export default function DialogInfo({ opened, handleClose, infoData }) {
  const [open, setOpen] = React.useState(opened);

  React.useEffect(() => {
    setOpen(opened);
  }, [opened]);

  if (infoData == undefined) return;
  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <Stack direction={"column"} width={"100%"} p={1}>
        <DialogTitle>INFO PARTITA</DialogTitle>
        <Stack direction={"row"} spacing={1} width={"100%"}>
          <LabelInfo label={"Codice"} value={infoData.codice} />
          <LabelInfo
            label={"Codice articolo"}
            value={infoData.codiceArticolo}
          />
        </Stack>
        <Stack direction={"row"} spacing={1} width={"100%"}>
          <LabelInfo label={"Spessore"} value={infoData.spessore} />
          <LabelInfo label={"Altezza"} value={infoData.altezza} />
          <LabelInfo label={"Lunghezza"} value={infoData.lunghezza} />
        </Stack>
        <Typography variant="h6">DATI FATTURA</Typography>
        <Stack direction={"row"} spacing={1} width={"100%"}>
          <LabelInfo label={"Codice"} value={infoData.codiceFattura} />
          <LabelInfo
            label={"Data"}
            value={dayjs(infoData.dataFattura).format("DD/MM/YYYY")}
          />
        </Stack>
        <Stack direction={"row"} spacing={1} width={"100%"}>
          <LabelInfo
            label={"Qta"}
            value={infoData.qtaFattura + " " + infoData.unitaMisuraFattura}
          />
          <LabelInfo label={"Qta Kg"} value={infoData.qtaKgFattura} />
        </Stack>
        <LabelInfo label={"Valore"} value={infoData.valoreFattura} />
        <Button color="error" variant="outlined" startIcon={<DownloadIcon />}>
          Scarica file fattura
        </Button>
      </Stack>
    </Dialog>
  );
}
