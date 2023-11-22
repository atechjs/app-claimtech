import React from "react";
import useTagSelect from "../fetching/useTagSelect";
import MyReactSelect from "../my-react-select-impl/myReactSelect";
import { Button, Stack } from "@mui/material";
import { useForm } from "react-hook-form";

export default function AssegnaTag({ onSubmit, onBack }) {
  const { tagList } = useTagSelect();

  const form = useForm({
    defaultValues: {
      assegna: true,
      tags: [],
    },
  });

  const operazioneList = [
    { label: "ASSEGNA", value: true },
    { label: "RIMUOVI", value: false },
  ];

  const {
    register,
    handleSubmit,
    formState,
    reset,
    control,
    getValues,
    watch,
  } = form;
  const { errors } = formState;

  const selectStyles = {
    menu: (base) => ({
      ...base,
      zIndex: 100,
    }),
  };

  const handleInternalSubmit = (data) => {
    onSubmit(data);
  };

  return (
    <Stack
      component="form"
      noValidate
      sx={{ mt: 1 }}
      onSubmit={handleSubmit(handleInternalSubmit)}
      direction={"column"}
      spacing={1}
      p={1}
    >
      <MyReactSelect
        control={control}
        name="assegna"
        label="Operazione"
        options={operazioneList}
        menuPosition="fixed"
        styles={selectStyles}
      />
      {tagList ? (
        <MyReactSelect
          control={control}
          name="tags"
          label="Tag"
          options={tagList}
          menuPosition="fixed"
          styles={selectStyles}
          isMulti
        />
      ) : (
        <></>
      )}
      <Stack
        direction="row-reverse"
        justifyContent="flex-start"
        alignItems="center"
        spacing={2}
        p={2}
      >
        <Button
          type="submit"
          variant="contained"
          disabled={watch("tags").length === 0}
        >
          Conferma
        </Button>
        <Button variant="text" onClick={() => onBack()}>
          Annulla
        </Button>
      </Stack>
    </Stack>
  );
}
