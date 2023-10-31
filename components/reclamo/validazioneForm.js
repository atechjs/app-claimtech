import React from "react";
import useFormSelect from "../fetching/useFormSelect";
import MyReactSelect from "../my-react-select-impl/myReactSelect";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Stack } from "@mui/material";

export default function ValidazioneForm({ dataReclamo, onFormValidato }) {
  const { formList } = useFormSelect();

  const schema = yup.object({
    idForm: yup.number("Obbligatorio").required("Obbligatorio"),
  });
  const form = useForm({
    defaultValues: {
      idForm: dataReclamo.idForm,
    },
    resolver: yupResolver(schema),
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
  const selectStyles = {
    menu: (base) => ({
      ...base,
      zIndex: 100,
    }),
  };

  const onSubmit = (data) => {
    const codiceForm = formList.find((x) => x.value === data.idForm).label;
    onFormValidato({
      ...data,
      codiceForm: codiceForm,
    });
  };

  if (dataReclamo.idForm && dataReclamo.idForm !== null)
    onFormValidato(dataReclamo);

  return (
    <Stack
      direction={"column"}
      spacing={1}
      width={"100%"}
      component="form"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      p={1}
    >
      {formList ? (
        <MyReactSelect
          control={control}
          name="idForm"
          label="Form*"
          options={formList}
          styles={selectStyles}
          autoFocus={true}
        />
      ) : (
        <></>
      )}
      <Stack direction={"row"} width={"100%"}>
        <Button type="submit" variant="contained">
          Associa form
        </Button>
      </Stack>
    </Stack>
  );
}
