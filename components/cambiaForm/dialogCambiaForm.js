import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import { useForm, Controller } from "react-hook-form";
import { Button, Stack } from "@mui/material";
import useFormSelect from "../fetching/useFormSelect";
import MyReactSelect from "../my-react-select-impl/myReactSelect";
import Alert from "@mui/material/Alert";

export default function DialogCambiaForm({ opened, handleClose, onSubmit }) {
  const [open, setOpen] = React.useState(opened);

  React.useEffect(() => {
    setOpen(opened);
  }, [opened]);

  const handleOnBack = () => {
    handleClose();
  };

  const form = useForm({
    defaultValues: {
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
    watch,
    setValue,
  } = form;
  const { errors } = formState;

  const handleInternalSubmit = (data) => {
    onSubmit(data);
    handleClose();
  };

  const { formList } = useFormSelect();

  const selectStyles = {
    menu: (base) => ({
      ...base,
      zIndex: 100,
    }),
  };
  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>Aggiorna form reclamo</DialogTitle>
      <Stack
        component="form"
        noValidate
        sx={{ mt: 1 }}
        onSubmit={handleSubmit(handleInternalSubmit)}
        direction={"column"}
        spacing={1}
        p={1}
      >
        {formList ? (
          <MyReactSelect
            control={control}
            name="idForm"
            label="Nuovo form"
            options={formList}
            menuPosition="fixed"
            styles={selectStyles}
          />
        ) : null}
        {watch("idForm") !== null ? (
          <Alert severity="warning">
            Attenzione la modifica del form può comportare la perdita di alcuni
            dati.
          </Alert>
        ) : null}
        <Stack direction={"row-reverse"}>
          <Button
            type="submit"
            variant="contained"
            disabled={watch("idForm") === null}
          >
            Salva
          </Button>
          <Button variant="text" onClick={() => handleOnBack()}>
            Annulla
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
}
