import { Button, Stack, TextField } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import useAllSistemaEsternoSelect from "../../components/fetching/useAllSistemaEsternoSelect";
import MyReactSelect from "../my-react-select-impl/myReactSelect";
import useStabilimentiSelect from "../fetching/useStabilimentiSelect";
import useFormSelect from "../fetching/useFormSelect";

export default function AggiungiClienteForm({ onSubmit }) {
  const form = useForm({
    defaultValues: {
      idStabilimento: null,
      idForm: null,
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
  } = form;
  const { errors } = formState;
  const { stabilimentiList } = useStabilimentiSelect();
  const { formList } = useFormSelect();

  const onSubmitInternal = () => {
    let data = getValues();
    data = {
      ...data,
      codiceStabilimento: stabilimentiList.find(
        (x) => x.value === data.idStabilimento
      ).label,
      codiceForm: formList.find((x) => x.value === data.idForm).label,
    };
    setValue("idStabilimento", null);
    setValue("idForm", null);
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
      {stabilimentiList ? (
        <MyReactSelect
          control={control}
          name="idStabilimento"
          label="Stabilimento"
          options={stabilimentiList}
          menuPosition="fixed"
          isFullWidth={true}
        />
      ) : (
        <></>
      )}
      {formList ? (
        <MyReactSelect
          control={control}
          name="idForm"
          label="Form"
          options={formList}
          menuPosition="fixed"
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
