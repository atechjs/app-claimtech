import React from "react";
import { useForm } from "react-hook-form";
import useWorkflowGestioneReclamoSelect from "../fetching/useWorkflowGestioneReclamoSelect";
import MyReactSelect from "../my-react-select-impl/myReactSelect";
import { Button, Stack } from "@mui/material";

export default function ApplicaATuttiProposta({ onSubmit }) {
  const options = [
    { label: "ACCETTA", value: "ACCETTA" },
    { label: "MODIFICA", value: "MODIFICA" },
  ];

  const form = useForm({
    defaultValues: {
      azione: null,
      idWorkflowGestioneReclamo: null,
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
  const { workflowGestioneReclamoList } = useWorkflowGestioneReclamoSelect();

  return (
    <Stack
      spacing={1}
      direction={"row"}
      justifyContent="flex-start"
      alignItems="flex-end"
      width={"100%"}
      component={"form"}
      onSubmit={handleSubmit(onSubmit)}
    >
      <MyReactSelect
        control={control}
        name="azione"
        label="Azione"
        options={options}
        menuPosition="fixed"
        validation={{ required: true }}
      />
      {watch("azione") === "MODIFICA" && workflowGestioneReclamoList ? (
        <MyReactSelect
          control={control}
          name="idWorkflowGestioneReclamo"
          label="Proposta alternativa"
          options={workflowGestioneReclamoList}
          menuPosition="fixed"
          validation={{ required: true }}
        />
      ) : null}
      <Button type="submit" variant="outlined">
        Applica a tutti
      </Button>
    </Stack>
  );
}
