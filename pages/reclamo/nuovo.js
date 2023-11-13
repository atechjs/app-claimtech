import React, { useState, useRef } from "react";
import Layout from "../../components/layout";
import NestedAppbar from "../../components/nestedAppbar";
import HorizontalLinearStepper from "../../components/reclamiAssegnati/horizontalLinearStepper";
import InserimentoOdl from "../../components/reclamo/inserimentoOdl";
import { Stack } from "@mui/material";
import ValidazioneCliente from "../../components/reclamo/validazioneCliente";
import InserimentoDatiFornitura from "../../components/reclamo/inserimentoDatiFornitura";
import SelezioneDatiFornitura from "../../components/reclamo/selezioneDatiFornitura";
import InserimentoDatiReclamo from "../../components/reclamo/inserimentoDatiReclamo";
import GetCurrentAxiosInstance from "../../utils/Axios";
import getApiUrl from "../../utils/BeUrl";
import { mandaNotifica } from "../../utils/ToastUtils";
import { useRouter } from "next/router";
import ValidazioneForm from "../../components/reclamo/validazioneForm";
/*
Possono esistere reclami che non hanno ODL?
Dal reclamo devo prendere il cliente
Passo 1 -
Se esiste il cliente visualizzo i suoi dati in formato non modificabile
altrimenti con caselle di testo e devo inserire dati del cliente.
(FORM,VALUTA,ALTRO???)
Passo 2 -
Ottengo dati bobine da Embyon, ottengo form, creo le combinazioni e le presento all'utente
L'utente compila il form
Passo 3(Opzionale) - Note e file aggiuntivi
A questo punto il programma crea il reclamo
*/

export default function Page() {
  const [step, setStep] = useState(0);
  const [dataReclamo, setDataReclamo] = useState({});
  const windowSize = useRef([window.innerWidth, window.innerHeight]);
  const instance = GetCurrentAxiosInstance();
  const router = useRouter();

  const onOdlInserito = (data) => {
    setDataReclamo(data);
    setStep(1);
  };

  const onClienteValidato = (data) => {
    setDataReclamo({ ...dataReclamo, ...data });
    setStep(2);
  };

  const onFormValidato = (data) => {
    setDataReclamo({ ...dataReclamo, ...data });
    setStep(3);
  };

  const onDatiInseriti = (data) => {
    setDataReclamo({ ...dataReclamo, ...data });
    setStep(4);
  };

  const onDatiFornituraSelezionati = (data) => {
    const idCausaReclamoList = dataReclamo.idCausaReclamoList;

    let dataModificata = [];
    data.forEach(
      (partita) =>
        (dataModificata = [
          ...dataModificata,
          { ...partita, idCausaReclamoList: idCausaReclamoList },
        ])
    );
    setDataReclamo({ ...dataReclamo, partitaList: dataModificata });
    setStep(5);
  };

  const onDatiFornituraInseriti = (data) => {
    const obj = { ...dataReclamo, ...data };
    setDataReclamo(obj);
    instance
      .post(getApiUrl() + "api/reclamo/nuovo", obj)
      .then((response) => {
        router.push(response.data + "/generale");
      })
      .catch(() =>
        mandaNotifica(
          "Si sono verificati errori nel salvataggio del reclamo",
          "error"
        )
      );
  };

  const creaLayoutStep = () => {
    switch (step) {
      case 0:
        return <InserimentoOdl onOdlInserito={onOdlInserito} />;
      case 1:
        return (
          <ValidazioneCliente
            dataReclamo={dataReclamo}
            onClienteValidato={onClienteValidato}
          />
        );
      case 2:
        return (
          <ValidazioneForm
            dataReclamo={dataReclamo}
            onFormValidato={onFormValidato}
          />
        );
      case 3:
        return (
          <InserimentoDatiReclamo
            dataReclamo={dataReclamo}
            onDatiInseriti={onDatiInseriti}
          />
        );
      case 4:
        return (
          <SelezioneDatiFornitura
            dataReclamo={dataReclamo}
            onDatiFornituraSelezionati={onDatiFornituraSelezionati}
          />
        );
      case 5:
        return (
          <InserimentoDatiFornitura
            dataReclamo={dataReclamo}
            onDatiFornituraInseriti={onDatiFornituraInseriti}
          />
        );
      case 5:
    }
  };

  const width = windowSize.current[0];

  const onStepClick = (s) => {
    if (s < step) setStep(s);
  };

  return (
    <Stack direction={"column"} spacing={1}>
      <NestedAppbar title={"Nuovo reclamo"}>
        <HorizontalLinearStepper
          step={step}
          width={windowSize.current[0] - 240}
          onStepClick={onStepClick}
          buttonIndietro={true}
        />
      </NestedAppbar>
      <Stack direction={"column"} p={2}>
        {creaLayoutStep()}
      </Stack>
    </Stack>
  );
}

Page.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
