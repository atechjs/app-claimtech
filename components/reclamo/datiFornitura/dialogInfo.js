import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import { Button, Divider, Stack, Typography } from "@mui/material";
import LabelInfo from "../LabelInfo";
import dayjs from "dayjs";
import DownloadIcon from "@mui/icons-material/Download";
import GetCurrentAxiosInstance from "../../../utils/Axios";
import getApiUrl from "../../../utils/BeUrl";
import { mandaNotifica } from "../../../utils/ToastUtils";

export default function DialogInfo({
  opened,
  handleClose,
  infoData,
  codiceValuta,
}) {
  const [open, setOpen] = React.useState(opened);
  const instance = GetCurrentAxiosInstance();
  console.log("infoData", infoData);
  React.useEffect(() => {
    setOpen(opened);
  }, [opened]);

  const scaricaPdfFattura = () => {
    const idReclamo = infoData.idReclamo;
    const nomePdf = infoData.nomePdf;
    const codiceFattura = infoData.codiceFattura;
    const url =
      getApiUrl() +
      "api/reclamo/pdfFattura?idReclamo=" +
      idReclamo +
      "&nomePdf=" +
      nomePdf;
    instance({
      url,
      method: "GET",
      responseType: "blob",
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
          <LabelInfo
            label={"Codice articolo"}
            value={infoData.codiceArticolo}
          />
          <LabelInfo label={"Spessore"} value={infoData.spessore} />
          <LabelInfo label={"Altezza"} value={infoData.altezza} />
          <LabelInfo label={"Lunghezza"} value={infoData.lunghezza} />
        </Stack>
        <Divider />
        <Stack direction={"row"} spacing={1} width={"100%"}>
          <LabelInfo label={"Linea"} value={infoData.codiceLinea} />
          <LabelInfo
            label={"Data di produzione"}
            value={dayjs(infoData.dataProduzione).format("DD/MM/YYYY")}
          />
        </Stack>
        <Divider />
        <Stack direction={"row"} spacing={1} width={"100%"}>
          <LabelInfo label={"Fattura"} value={infoData.codiceFattura} />
          <LabelInfo
            label={"Data"}
            value={dayjs(infoData.dataFattura).format("DD/MM/YYYY")}
          />
          <LabelInfo
            label={"Qta " + infoData.unitaMisuraFattura}
            value={infoData.qtaFattura}
          />
          <LabelInfo label={"Qta Kg"} value={infoData.qtaKgFattura} />
        </Stack>
        <Stack direction={"row"} spacing={1} width={"100%"}></Stack>
        <Stack direction={"row"} spacing={3} width={"100%"}>
          <LabelInfo label={"Valore totale"} value={infoData.valoreFattura} />
          <LabelInfo
            label={
              "Coefficiente " + codiceValuta + "/" + infoData.unitaMisuraFattura
            }
            value={(infoData.valoreFattura / infoData.qtaFattura).toFixed(4)}
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
