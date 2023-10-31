import React, { useEffect, useState } from "react";
import { Controller, Form, useForm } from "react-hook-form";
import MyReactSelect from "./my-react-select-impl/myReactSelect";
import { Button, Stack, Typography } from "@mui/material";
import Divider from "@mui/material/Divider";
import useFaseSelettore from "./fetching/useFaseSelettore";
import GetCurrentAxiosInstance from "../utils/Axios";
import getApiUrl from "../utils/BeUrl";
import { mandaNotifica } from "../utils/ToastUtils";
export default function SelectCambiaFase({
  reclamiList,
  onUpdateReclami,
  fl,
  idFase,
}) {
  const form = useForm({
    defaultValues: {
      reclamiList: reclamiList,
      idFase: idFase,
    },
  });
  const [fasiList, setFasiList] = useState([]);

  const { register, handleSubmit, formState, reset, control, getValues } = form;
  const { errors } = formState;

  const instance = GetCurrentAxiosInstance();

  useEffect(() => {
    setFasiList(fl);
  }, [fl]);

  useEffect(() => {
    reset({ reclamiList: reclamiList, idFase: idFase });
  }, [reclamiList]);

  const onSubmit = (data) => {
    const l = data.reclamiList.map((x) => x[0]);
    if (data.idFase === idFase) return;
    instance
      .post(getApiUrl() + "api/reclamo/cambiaFase", {
        ...data,
        idReclamiList: l,
      })
      .then((response) => {
        mandaNotifica("Reclami aggiornati", "success");
        onUpdateReclami(response);
      })
      .catch(() =>
        mandaNotifica("Impossibile aggiornare la fase dei reclami", "error")
      );
  };

  return (
    <Stack
      direction={"row"}
      onSubmit={handleSubmit(onSubmit)}
      component={"form"}
      spacing={1}
      noValidate
      justifyContent="flex-start"
      alignItems="center"
    >
      <Typography variant="button" gutterBottom>
        STATO RECLAMO
      </Typography>
      <MyReactSelect
        control={control}
        name="idFase"
        label=""
        options={fasiList}
        styles={{
          placeholder: (provided) => ({
            ...provided,
            position: "static",
            transform: "none",
          }),
          singleValue: (provided) => ({
            ...provided,
            position: "static",
            transform: "none",
          }),
        }}
      />
      <Button type="submit" variant="outlined">
        Salva
      </Button>
    </Stack>
  );
}
