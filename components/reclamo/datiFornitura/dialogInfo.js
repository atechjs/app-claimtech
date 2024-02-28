import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import { Button, Divider, Stack, Typography } from "@mui/material";

import dayjs from "dayjs";
import DownloadIcon from "@mui/icons-material/Download";
import GetCurrentAxiosInstance from "../../../utils/Axios";
import getApiUrl from "../../../utils/BeUrl";
import { mandaNotifica } from "../../../utils/ToastUtils";
import LabelInformazione from "../labelInformazione";

export default function DialogInfo({
  opened,
  handleClose,
  infoData,
  codiceValuta,
}) {
  const [open, setOpen] = React.useState(opened);
  const instance = GetCurrentAxiosInstance();
  React.useEffect(() => {
    setOpen(opened);
  }, [opened]);

  const scaricaPdfFattura = () => {
    const idReclamo = infoData.idReclamo;
    const nomePdf = infoData.nomePdf;
    const codiceFattura = infoData.codiceFattura;
    const nomePdfDef = nomePdf;
    const url = getApiUrl() + "api/reclamo/pdfFattura";
    instance({
      url,
      method: "POST",
      responseType: "blob",
      data: {
        nomePdf: nomePdfDef,
      },
    })
      .then((response) => {
        const href = window.URL.createObjectURL(response.data);
        const anchorElement = document.createElement("a");
        anchorElement.href = href;
        anchorElement.download = codiceFattura + ".pdf";
        document.body.appendChild(anchorElement);
        anchorElement.click();
        document.body.removeChild(anchorElement);
        window.URL.revokeObjectURL(href);
        mandaNotifica("Fattura scaricata correttamente", "success");
        handleClose();
      })
      .catch((error) => {
        mandaNotifica("Impossibile generare il report", "error");
        console.log("error", error);
      });
  };

  if (infoData == undefined) return;
  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth={"sm"}>
      <Stack direction={"column"} width={"100%"} p={1}>
        <DialogTitle>INFO PARTITA {infoData.codice}</DialogTitle>
        <Stack direction={"row"} spacing={1} width={"100%"}>
          <LabelInformazione
            label={"Codice articolo"}
            value={infoData.codiceArticolo}
          />
          <LabelInformazione label={"Spessore"} value={infoData.spessore} />
          <LabelInformazione label={"Altezza"} value={infoData.altezza} />
          <LabelInformazione label={"Lunghezza"} value={infoData.lunghezza} />
        </Stack>
        <Divider />
        <Stack direction={"row"} spacing={1} width={"100%"}>
          <LabelInformazione label={"Linea"} value={infoData.codiceLinea} />
          <LabelInformazione
            label={"Data di produzione"}
            value={dayjs(infoData.dataProduzione).format("DD/MM/YYYY")}
          />
        </Stack>
        <Divider />
        <Stack direction={"row"} spacing={1} width={"100%"}>
          <LabelInformazione label={"Fattura"} value={infoData.codiceFattura} />
          <LabelInformazione
            label={"Data"}
            value={dayjs(infoData.dataFattura).format("DD/MM/YYYY")}
          />
          <LabelInformazione
            label={"Qta " + infoData.unitaMisuraFattura}
            value={infoData.qtaFattura}
          />
          <LabelInformazione label={"Qta Kg"} value={infoData.qtaKgFattura} />
        </Stack>
        <Stack direction={"row"} spacing={1} width={"100%"}></Stack>
        <Stack direction={"row"} spacing={3} width={"100%"}>
          <LabelInformazione
            label={"Valore totale"}
            value={infoData.valoreFattura}
          />
          <LabelInformazione
            label={
              "Coefficiente " + codiceValuta + "/" + infoData.unitaMisuraFattura
            }
            value={(
              (infoData.valoreFattura / infoData.qtaFattura) *
              infoData.cambioValuta
            ).toFixed(4)}
          />
        </Stack>
        <Button
          color="error"
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={() => scaricaPdfFattura()}
        >
          Scarica file fattura
        </Button>
      </Stack>
    </Dialog>
  );
}
