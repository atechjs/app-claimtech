import React from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import dayjs from "dayjs";
import DatiReso from "./datiReso";
import GetCurrentAxiosInstance from "../../utils/Axios";
import getApiUrl from "../../utils/BeUrl";
import { mandaNotifica } from "../../utils/ToastUtils";

export default function ModificaReso({ reso, onSubmitReso }) {
  const instance = GetCurrentAxiosInstance();

  const internalSubmit = (values) => {
    const formData = new FormData();
    formData.append(
      "fileReso",
      values.fileReso && values.fileReso.size ? values.fileReso : null
    );
    formData.append(
      "fileCmr",
      values.fileCmr && values.fileCmr.size ? values.fileCmr : null
    );
    formData.append(
      "data",
      new Blob(
        [
          JSON.stringify({
            ...values,
            id: reso.id,
            filenameCmr:
              values.fileCmr && values.fileCmr.size
                ? "MANTENERE"
                : values.fileCmr === null
                ? null
                : "MANTENERE",
          }),
        ],
        {
          type: "application/json",
        }
      )
    );
    instance
      .post(getApiUrl() + "api/reclamo/updateReso", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(() => {
        mandaNotifica("Reso aggiornato con successo", "success");
        onSubmitReso();
      })
      .catch(() =>
        mandaNotifica("Non è stato possibile salvare il reso", "error")
      );
  };

  return (
    <DatiReso
      onDatiResoSubmit={internalSubmit}
      additionalControls={null}
      initialValues={{
        codice: reso.codice,
        codiceCmr: reso.codiceCmr,
        data: dayjs(reso.data),
        fileReso: { name: reso.filenameFileReso },
        fileCmr: { name: reso.filenameFileCmr },
      }}
    ></DatiReso>
  );
}
