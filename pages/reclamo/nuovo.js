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
import dayjs from "dayjs";
import InserimentoDatiEvidenze from "../../components/reclamo/inserimentoDatiEvidenze";

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
    setStep(6);
  };

  const onDatiEvidenzeInseriti = (data, files) => {
    let obj = { ...dataReclamo, ...data };
    obj = {
      ...obj,
      timestampCreazione: dayjs(obj.timestampCreazione).format("DD/MM/YYYY"),
    };
    const formData = new FormData();
    formData.append(
      "ddd",
      new Blob([JSON.stringify(obj)], {
        type: "application/json",
      })
    );

    files.forEach((file) => {
      formData.append("files", file);
    });
    instance
      .post(getApiUrl() + "api/reclamo/nuovo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        router.push(response.data + "/generale");
      })
      .catch((error) => {
        mandaNotifica(
          "Si sono verificati errori nel salvataggio del reclamo",
          "error"
        );
      });
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
      case 6:
        return (
          <InserimentoDatiEvidenze
            dataReclamo={dataReclamo}
            onDatiEvidenzeInseriti={onDatiEvidenzeInseriti}
          />
        );
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
