import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import { Button, Stack, Typography } from "@mui/material";
import InserimentoOdl from "../inserimentoOdl";
import HorizontalLinearStepper from "../../reclamiAssegnati/horizontalLinearStepper";
import SelezioneDatiFornitura from "../selezioneDatiFornitura";
import InserimentoCausaReclamo from "../inserimentoCausaReclamo";
import { getPartitaList } from "../../../utils/partitaUtils";

export default function DialogAggiungiPartita({
  opened,
  handleClose,
  handleOnSubmit,
  columnsData,
  partitaList,
}) {
  const [step, setStep] = React.useState(0);
  const [open, setOpen] = React.useState(opened);
  const [dataReclamo, setDataReclamo] = React.useState({});

  React.useEffect(() => {
    setOpen(opened);
    setStep(0);
    setDataReclamo({});
  }, [opened]);

  const onOdlInserito = (data) => {
    setDataReclamo(data);
    setStep(1);
  };

  const onDatiFornituraSelezionati = (data) => {
    const dataReclamoNew = { ...dataReclamo, partitaList: [...data] };
    setDataReclamo(dataReclamoNew);
    setStep(2);
  };

  const onCausaReclamoSelezionata = (data) => {
    const causaReclamo = data;
    const partitaList = dataReclamo.partitaList;
    const final = partitaList.map((partita) => ({
      ...partita,
      idCausaReclamoList: [causaReclamo],
    }));
    handleOnSubmit(getPartitaList(columnsData, final));
  };

  const creaLayoutStep = () => {
    switch (step) {
      case 0:
        return <InserimentoOdl onOdlInserito={onOdlInserito} />;
      case 1:
        return (
          <SelezioneDatiFornitura
            dataReclamo={dataReclamo}
            onDatiFornituraSelezionati={onDatiFornituraSelezionati}
            partitaList={partitaList.map((x) => x.codice)}
          />
        );
      case 2:
        return (
          <InserimentoCausaReclamo
            onCausaReclamoSelezionata={onCausaReclamoSelezionata}
          />
        );
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullScreen>
      <Stack direction={"row"} width={"100%"}>
        <DialogTitle>Aggiungi partite</DialogTitle>
        <Stack direction="row-reverse" justifyContent="flex-end" width={"100%"}>
          <Button
            color="error"
            variant="outlined"
            size="small"
            onClick={() => handleClose()}
          >
            Annulla
          </Button>
        </Stack>
      </Stack>
      <HorizontalLinearStepper
        step={step}
        stepList={[
          "Ricerca ODL",
          "Selezione fornitura",
          "Selezione causa reclamo",
        ]}
      />
      {creaLayoutStep()}
    </Dialog>
  );
}
