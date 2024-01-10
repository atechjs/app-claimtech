import { Button, Stack, TextField } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import useAllSistemaEsternoSelect from "../../components/fetching/useAllSistemaEsternoSelect";
import MyReactSelect from "../my-react-select-impl/myReactSelect";
import useStabilimentiSelect from "../fetching/useStabilimentiSelect";
import useFormSelect from "../fetching/useFormSelect";
import useStatoFornituraSelect from "../fetching/useStatoFornituraSelect";
import useTipologiaDestinatarioSelect from "../fetching/useTipologiaDestinatarioSelect";
import useUtentiSelect from "../fetching/useUtentiSelect";
import useCausaSelect from "../fetching/useCausaSelect";

export default function AggiungiDestinatario({ onSubmit }) {
  const form = useForm({
    defaultValues: {
      idUtente: null,
      idStatoFornituraCausaReclamo: null,
      idCausaReclamoList: [],
      idTipologiaDestinatario: null,
    },
  });
  const { formState, control, getValues, setValue } = form;
  const { errors } = formState;
  const { statoFornituraList } = useStatoFornituraSelect();
  const { tipologiaDestinatarioList } = useTipologiaDestinatarioSelect();
  const { utentiList } = useUtentiSelect();
  const { causaList } = useCausaSelect();

  const onSubmitInternal = () => {
    let data = getValues();
    if (
      data.idUtente === null ||
      data.idStatoFornituraCausaReclamo === null ||
      data.idTipologiaDestinatario === null
    )
      return;

    data = {
      ...data,
      usernameUtente: utentiList.find((x) => x.value === data.idUtente).label,
      codiceStatoFornituraCausaReclamo: statoFornituraList.find(
        (x) => x.value === data.idStatoFornituraCausaReclamo
      ).label,
      codiceTipologiaDestinatario: tipologiaDestinatarioList.find(
        (x) => x.value === data.idTipologiaDestinatario
      ).label,
      codiceCausaReclamoList: data.idCausaReclamoList.map(
        (x) => causaList.find((y) => y.value === x).label
      ),
    };
    setValue("idUtente", null);
    setValue("idStatoFornituraCausaReclamo", null);
    setValue("idTipologiaDestinatario", null);
    setValue("idCausaReclamoList", []);
    onSubmit(data);
  };

  return (
    <Stack
      spacing={1}
      direction={"row"}
      justifyContent="flex-start"
      alignItems="flex-end"
      width={"100%"}
    >
      {utentiList ? (
        <MyReactSelect
          control={control}
          name="idUtente"
          label="Utente"
          options={utentiList}
          autosize={true}
          menuPortalTarget={document.body}
          menuPosition={"fixed"}
          isFullWidth={true}
        />
      ) : (
        <></>
      )}
      {statoFornituraList ? (
        <MyReactSelect
          control={control}
          name="idStatoFornituraCausaReclamo"
          label="Quando associare"
          options={statoFornituraList}
          autosize={true}
          menuPortalTarget={document.body}
          menuPosition={"fixed"}
          isFullWidth={true}
        />
      ) : (
        <></>
      )}
      {causaList ? (
        <MyReactSelect
          control={control}
          name="idCausaReclamoList"
          label="Solo per le cause"
          options={causaList}
          autosize={true}
          menuPortalTarget={document.body}
          menuPosition={"fixed"}
          isFullWidth={true}
          isMulti={true}
        />
      ) : (
        <></>
      )}
      {tipologiaDestinatarioList ? (
        <MyReactSelect
          control={control}
          name="idTipologiaDestinatario"
          label="Tipologia destinatario"
          options={tipologiaDestinatarioList}
          autosize={true}
          menuPortalTarget={document.body}
          menuPosition={"fixed"}
          isFullWidth={true}
        />
      ) : (
        <></>
      )}
      <Button variant="outlined" onClick={() => onSubmitInternal()}>
        aggiungi
      </Button>
    </Stack>
  );
}
