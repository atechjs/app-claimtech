import React, { useState } from "react";
import useVisualizzazioneSelect from "../fetching/useVisualizzazioneSelect";
import { useForm, Controller } from "react-hook-form";
import { Button, Stack, Checkbox, FormControlLabel } from "@mui/material";
import MyReactSelect from "../my-react-select-impl/myReactSelect";
import GetCurrentAxiosInstance from "../../utils/Axios";
import getApiUrl from "../../utils/BeUrl";
import { mandaNotifica } from "../../utils/ToastUtils";
import dayjs from "dayjs";
import { LoadingButton } from "@mui/lab";

export default function DownloadReportReclami({ idReclamoList, handleClose }) {
  const [loading, setLoading] = useState(false);

  const setVisualizzazioneTutti = (values) => {
    form.setValue(
      "idVisualizzazione",
      values.find((x) => x.label === "TUTTI").value
    );
  };
  const { visualizzazioneList } = useVisualizzazioneSelect(
    setVisualizzazioneTutti
  );
  const instance = GetCurrentAxiosInstance();

  const estensioneOptions = [
    { value: "EXCEL", label: "EXCEL" },
    { value: "PDF", label: "PDF" },
  ];
  const form = useForm({
    defaultValues: {
      idVisualizzazione: null,
      estensione: "EXCEL",
      includiCampi: true,
    },
  });
  const {
    register,
    handleSubmit,
    formState,
    reset,
    control,
    getValues,
    setValue,
    watch,
  } = form;
  const { errors } = formState;

  const getEstensione = (estensione) => {
    if (estensione === "EXCEL") return ".xlsx";
    return ".pdf";
  };

  const onSubmit = (values) => {
    setLoading(true);
    const url = getApiUrl() + "api/reclamo/reportReclamo";
    instance({
      url,
      method: "POST",
      responseType: "blob",
      data: { ...values, idReclamoList: idReclamoList },
    })
      .then((response) => {
        const href = window.URL.createObjectURL(response.data);

        const anchorElement = document.createElement("a");

        anchorElement.href = href;
        anchorElement.download =
          "report_" +
          dayjs().format("DD[_]MM[_]YYYY[_]HH[_]mm[_]ss") +
          getEstensione(values.estensione);

        document.body.appendChild(anchorElement);
        anchorElement.click();

        document.body.removeChild(anchorElement);
        window.URL.revokeObjectURL(href);
        mandaNotifica("Report generato correttamente", "success");
        handleClose();
      })
      .catch((error) => {
        mandaNotifica("Impossibile generare il report", "error");
        console.log("error", error);
      })
      .then(() => setLoading(false));
  };

  const selectStyles = {
    menu: (base) => ({
      ...base,
      zIndex: 100,
    }),
  };

  return (
    <Stack
      direction={"column"}
      spacing={1}
      component="form"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
    >
      {visualizzazioneList ? (
        <MyReactSelect
          control={control}
          name="idVisualizzazione"
          label="Visualizzazione"
          options={visualizzazioneList}
          menuPosition="fixed"
          styles={selectStyles}
        />
      ) : (
        <></>
      )}
      <MyReactSelect
        control={control}
        name="estensione"
        label="Estensione"
        options={estensioneOptions}
        menuPosition="fixed"
        styles={selectStyles}
      />
      {watch("estensione") === "EXCEL" ? (
        <Controller
          control={control}
          name={"includiCampi"}
          render={({ field: { onChange, value } }) => (
            <FormControlLabel
              control={<Checkbox checked={value} onChange={onChange} />}
              label="Includi campi"
            />
          )}
        />
      ) : null}
      <Stack direction={"row-reverse"} spacing={1}>
        <LoadingButton
          type="submit"
          variant="contained"
          disabled={watch("idVisualizzazione") === null}
          loading={loading}
        >
          Genera
        </LoadingButton>
        <Button onClick={() => handleClose()}>Annulla</Button>
      </Stack>
    </Stack>
  );
}
