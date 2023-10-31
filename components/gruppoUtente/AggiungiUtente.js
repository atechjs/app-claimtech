import MyReactSelect from "../my-react-select-impl/myReactSelect";
import React from "react";
import { useForm } from "react-hook-form";
import { Button, Stack } from "@mui/material";
import useUtentiSelect from "../fetching/useUtentiSelect";

export default function ({ onSubmit }) {
  const form = useForm({
    defaultValues: {
      id: null,
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
  const { utentiList } = useUtentiSelect();

  const onSubmitInternal = () => {
    let data = getValues();
    data = {
      ...data,
      username: utentiList.find((x) => x.value === data.id).label,
    };
    setValue("id", null);
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
          name="id"
          label="Utente"
          options={utentiList}
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
