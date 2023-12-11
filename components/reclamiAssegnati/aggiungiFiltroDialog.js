import React, { useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import {
  Button,
  Checkbox,
  FormControlLabel,
  Stack,
  TextField,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import MyReactSelect from "../my-react-select-impl/myReactSelect";
import useClienteSelect from "../fetching/useClienteSelect";
import useFaseSelect from "../fetching/useFaseSelect";
import useTagSelect from "../fetching/useTagSelect";
import useTipologiaReclamoSelect from "../fetching/useTipologiaReclamoSelect";
import useStatoFornituraSelect from "../fetching/useStatoFornituraSelect";
import useTipologiaStatoEvidenzaSelect from "../fetching/useTipologiaStatoEvidenzaSelect";
export default function AggiungiFiltroDialog({
  aperto,
  ooo,
  onSubmitCreaCallback,
  onSubmitUpdateCallback,
  defaultValues,
}) {
  const {
    clientiList,
    isLoading: clienteLoading,
    isError: clienteError,
  } = useClienteSelect();

  const {
    tipologiaReclamoList,
    isLoading: tipologiaReclamoLoading,
    isError: tipologiaReclamoError,
  } = useTipologiaReclamoSelect();

  const {
    data: fasiList,
    trigger: triggerFase,
    isMutating: isFaseMutating,
  } = useFaseSelect(undefined);

  const { statoFornituraList } = useStatoFornituraSelect();

  const { tagList, isLoading: tagLoading, isError: tagError } = useTagSelect();
  const statiList = [
    { label: "TUTTI", value: null },
    { label: "SOLO APERTI", value: true },
    { label: "SOLO CHIUSI", value: false },
  ];
  const { data: tipologiaStatoEvidenzaList } =
    useTipologiaStatoEvidenzaSelect();

  const form = useForm({
    defaultValues: {
      id: null,
      label: null,
      aperto: null,
      fasi: null,
      cliente: null,
      idTipologiaReclamo: null,
      idStatoFornitura: null,
      tagsContiene: null,
      tagsNonContiene: null,
      idTipologiaStatoEvidenzaList: null,
      pinned: null,
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
  } = form;
  const { errors } = formState;

  const onSubmit = (data) => {
    if (isDialogUpdate()) onSubmitUpdateCallback(data, reset);
    else onSubmitCreaCallback(data, reset);
  };

  function onCloseDialog() {
    reset();
    ooo();
  }
  const selectStyles = {
    menu: (base) => ({
      ...base,
      zIndex: 100,
    }),
  };

  const isDialogUpdate = () => {
    return getValues().id !== undefined;
  };
  useEffect(() => {
    let obj = {};
    Object.keys(getValues()).map((x) => (obj = { ...obj, x: null }));
    reset(obj);
    if (defaultValues !== undefined) reset(defaultValues);
  }, [defaultValues]);

  useEffect(() => {
    if (getValues("idTipologiaReclamo") === undefined) return;
    triggerFase({ id: getValues("idTipologiaReclamo") });
  }, [watch("idTipologiaReclamo")]);

  return (
    <Dialog open={aperto} onClose={() => onCloseDialog()} disableEscapeKeyDown>
      <DialogTitle>
        {isDialogUpdate()
          ? "Modifica la categoria"
          : "Aggiungi una nuova categoria"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {isDialogUpdate()
            ? "Compila il form seguente per modificare la categoria selezionata"
            : "Compila il form seguente per aggiungere una nuova categoria alla tua collezione"}
        </DialogContentText>
        <Stack
          component="form"
          noValidate
          sx={{ mt: 1 }}
          onSubmit={handleSubmit(onSubmit)}
          spacing={1}
          direction={"column"}
        >
          <Stack spacing={1} direction={"column"}>
            <TextField
              {...register("label", {
                required: "La descrizione è obbligatoria",
              })}
              size="small"
              margin="normal"
              required
              fullWidth
              id="label"
              label="Descrizione"
              name="label"
              error={!!errors.label}
              helperText={errors.label?.message}
              autoFocus
            />
            <MyReactSelect
              control={control}
              name="aperto"
              label="Stato reclamo(facoltativo)"
              options={statiList}
              menuPosition="fixed"
              styles={selectStyles}
            />
            {tipologiaReclamoList ? (
              <MyReactSelect
                control={control}
                name="idTipologiaReclamo"
                label="Tipologia reclamo(facoltativo)"
                options={tipologiaReclamoList}
                menuPosition="fixed"
                styles={selectStyles}
              />
            ) : (
              <></>
            )}
            {watch("idTipologiaReclamo") != null ? (
              <MyReactSelect
                control={control}
                name="fasi"
                label="Fasi(facoltativo)"
                options={fasiList}
                menuPosition="fixed"
                styles={selectStyles}
                isMulti
              />
            ) : (
              <></>
            )}
            <MyReactSelect
              control={control}
              name="idTipologiaStatoEvidenzaList"
              label="Ha evidenze in stato(facoltativo)"
              options={tipologiaStatoEvidenzaList}
              menuPosition="fixed"
              styles={selectStyles}
              isMulti
            />
            <MyReactSelect
              control={control}
              name={"idStatoFornitura"}
              label={"Contiene almeno una bobina con stato"}
              options={[{ value: null, label: "TUTTI" }].concat(
                statoFornituraList
              )}
              menuPosition="fixed"
              styles={selectStyles}
            />
            <MyReactSelect
              control={control}
              name="cliente"
              label="Cliente(facoltativo)"
              options={clientiList}
              menuPosition="fixed"
              styles={selectStyles}
            />
            <MyReactSelect
              control={control}
              name="tagsContiene"
              label="Ha i Tags(facoltativo)"
              options={tagList}
              menuPosition="fixed"
              styles={selectStyles}
              isMulti
            />
            <MyReactSelect
              control={control}
              name="tagsNonContiene"
              label="Non ha i Tags(facoltativo)"
              options={tagList}
              menuPosition="fixed"
              styles={selectStyles}
              isMulti
            />
            <Controller
              control={control}
              name={"pinned"}
              render={({ field: { onChange, value } }) => (
                <FormControlLabel
                  control={<Checkbox checked={value} onChange={onChange} />}
                  label="Fissa in alto"
                />
              )}
            />
          </Stack>
          <Stack direction={"row-reverse"} spacing={2}>
            <Button type="submit" variant="contained">
              {isDialogUpdate() ? "Aggiorna" : "Crea"}
            </Button>
            <Button onClick={() => onCloseDialog()}>Annulla</Button>
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions></DialogActions>
    </Dialog>
  );
}
