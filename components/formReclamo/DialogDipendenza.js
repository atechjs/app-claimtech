import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useForm } from "react-hook-form";
import MyReactSelect from "../my-react-select-impl/myReactSelect";
import { Chip, Stack, Tooltip, Typography } from "@mui/material";
import Divider from "@mui/material/Divider";

export default function DialogDipendenza({
  opened,
  handleClose,
  data,
  campoList,
  onDialogDipendenzaSubmit,
}) {
  const [open, setOpen] = React.useState(opened);

  const form = useForm({
    defaultValues: {
      id: null,
      idDipendente: null,
      codiceDipendente: null,
      expr: " ",
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

  React.useEffect(() => {
    setOpen(opened);
  }, [opened]);

  React.useEffect(() => {
    reset(data);
  }, [data]);

  const selectStyles = {
    menu: (base) => ({
      ...base,
      zIndex: 100,
    }),
  };

  const parametriList = [
    { value: "[value]", label: "Valore campo" },
    { value: "[kgFattura]", label: "KG Fattura" },
    { value: "[qtaFattura]", label: "QTA Fattura" },
    { value: "[coefFattura]", label: "VALORE FATTURA / QTA FORNITA" },
    { value: "[cCartaAdesivo]", label: "Costo carta e adesivo" },
    { value: "[cRibob]", label: "Costo ribobinatura" },
    { value: "[cFermoMacchina]", label: "Costo fermo macchina" },
    { value: "[spessoreArticolo]", label: "Spessore articolo" },
    { value: "[altezzaArticolo]", label: "Altezza articolo" },
    { value: "[lunghezzaArticolo]", label: "Lunghezza articolo" },
  ];

  const operazioneList = [
    { value: "+", label: "+" },
    { value: "-", label: "-" },
    { value: "*", label: "*" },
    { value: "/", label: "/" },
    { value: "(", label: "(" },
    { value: ")", label: ")" },
  ];

  const aggiungiAEspressione = (value) => {
    setValue("expr", getValues("expr") + value);
  };

  const onSubmit = (value) => {
    onDialogDipendenzaSubmit(data.codiceDipendente, value);
  };

  return (
    <Dialog open={open} onClose={handleClose} fullScreen>
      <DialogTitle>Modifica dipendenza</DialogTitle>
      <DialogContent>
        <Stack
          direction={"column"}
          component="form"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          spacing={1}
        >
          {campoList ? (
            <MyReactSelect
              control={control}
              name="codiceDipendente"
              label="Campo dipendente*"
              options={campoList}
              menuPosition="fixed"
              styles={selectStyles}
              validation={{
                required: "Il tipo campo è obbligatorio",
              }}
            />
          ) : null}
          <Typography variant="button">Legenda editor espressione:</Typography>
          <Typography variant="body1">
            Premi su un pulsante per aggiungerlo all'espressione
          </Typography>
          <Stack direction={"row"} spacing={2}>
            <Stack direction={"column"} width={"100%"} spacing={1}>
              <Typography>Operatori</Typography>
              {campoList.map((x) => (
                <Chip
                  label={x.label}
                  onClick={() => aggiungiAEspressione("[" + x.value + "]")}
                />
              ))}
            </Stack>
            <Divider orientation="vertical" flexItem />
            <Stack direction={"column"} width={"100%"} spacing={1}>
              <Typography>Parametri</Typography>
              {parametriList.map((x) => (
                <Chip
                  label={x.label}
                  onClick={() => aggiungiAEspressione(x.value)}
                />
              ))}
            </Stack>
            <Divider orientation="vertical" flexItem />
            <Stack direction={"column"} width={"100%"} spacing={1}>
              <Typography>Operandi</Typography>
              {operazioneList.map((x) => (
                <Chip
                  label={x.label}
                  onClick={() => aggiungiAEspressione(x.value)}
                />
              ))}
            </Stack>
          </Stack>

          <TextField
            {...register("expr", {
              required: "Espressione è obbligatoria",
            })}
            size="small"
            margin="normal"
            id="expr"
            label="Espressione"
            defaultValue={" "}
            name="expr"
            error={!!errors.expr}
            helperText={errors.expr?.message}
            fullWidth
            required
          />
          <Stack
            spacing={1}
            direction={"row"}
            justifyContent="flex-end"
            alignItems="center"
          >
            <Button color="error" onClick={() => handleClose()}>
              Annulla
            </Button>
            <Button onClick={handleSubmit(onSubmit)} variant="contained">
              Salva
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
