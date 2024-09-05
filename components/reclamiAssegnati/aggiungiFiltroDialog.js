import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";

import { motion } from 'framer-motion'
import {
  Box,
  Button,
  Checkbox,
  Divider,
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
import useStabilimentiSelect from "../fetching/useStabilimentiSelect";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TabFiltroDialog from "./tabFiltroDialog";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { CheckBoxSharp } from "@mui/icons-material";
import { ChartSuccess, Record, RecordCircle, TickCircle } from "iconsax-react";
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
    { label: "Tutti", value: null },
    { label: "Solo aperti", value: true },
    { label: "Solo chiusi", value: false },
  ];

  const rateoOptions = [
    { label: "Si", value: true },
    { label: "No", value: false },
  ];
  const { data: tipologiaStatoEvidenzaList } =
    useTipologiaStatoEvidenzaSelect();

  const { stabilimentiList } = useStabilimentiSelect();

  const form = useForm({
    defaultValues: {
      id: null,
      label: null,
      aperto: null,
      fasi: null,
      cliente: null,
      idTipologiaReclamo: null,
      idStatoFornitura: null,
      descrizioneArticoloContiene: null,
      descrizioneArticoloNonContiene: null,
      tagsContiene: null,
      tagsNonContiene: null,
      idTipologiaStatoEvidenzaList: null,
      idStabilimento: null,
      pinned: null,
      timestampCreazioneAttivo: false,
      timestampCreazioneDa: null,
      timestampCreazioneA: null,
      timestampChiusuraAttivo: false,
      timestampChiusuraDa: null,
      timestampChiusuraA: null,
      rateoAttivo: false,
      rateo: false,
      annoRateo: null,
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
    setValue: setValueForm,
  } = form;
  const { errors } = formState;

  const onSubmit = (data) => {
    const valOrNull = (val) => {
      if (val && val !== null) return dayjs(val).format("DD/MM/YYYY");
      return null;
    };
    const finalData = {
      ...data,
      timestampCreazioneDa: valOrNull(data.timestampCreazioneDa),
      timestampCreazioneA: valOrNull(data.timestampCreazioneA),
      timestampChiusuraDa: valOrNull(data.timestampChiusuraDa),
      timestampChiusuraA: valOrNull(data.timestampChiusuraA),
    };
    if (isDialogUpdate()) onSubmitUpdateCallback(finalData, reset);
    else onSubmitCreaCallback(finalData, reset);
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
    if (defaultValues !== undefined)
      reset({
        ...defaultValues,
        timestampCreazioneAttivo:
          (defaultValues.timestampCreazioneDa &&
            defaultValues.timestampCreazioneDa !== null) ||
          (defaultValues.timestampCreazioneA &&
            defaultValues.timestampCreazioneA !== null)
            ? true
            : false,
        timestampChiusuraAttivo:
          (defaultValues.timestampChiusuraDa &&
            defaultValues.timestampChiusuraDa !== null) ||
          (defaultValues.timestampChiusuraA &&
            defaultValues.timestampChiusuraA !== null)
            ? true
            : false,
        rateoAttivo:
          (defaultValues.rateo !== undefined && defaultValues.rateo !== null) ||
          (defaultValues.annoRateo !== undefined &&
            defaultValues.annoRateo !== null)
            ? true
            : false,
      });
    setValue(0);
  }, [defaultValues]);



  useEffect(() => {
    if (getValues("idTipologiaReclamo") === undefined) return;
    triggerFase({ id: getValues("idTipologiaReclamo") });
  }, [watch("idTipologiaReclamo")]);


  const [value, setValue] = React.useState(0);
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (newValue) => {
    setValue(newValue);
  };
  

  


  return (
    <Dialog
      open={aperto}
      onClose={() => onCloseDialog()}
      disableEscapeKeyDown
      fullWidth
      maxWidth="md"
      className="border"
    >
      <h1 className="text-gray-800 font-medium pl-5 pt-5 pb-1 text-xl text-primary " >
        {isDialogUpdate()
          ? "Modifica la categoria"
          : "Aggiungi una nuova categoria"}
      </h1>
      <p className="text-xs pl-5 pb-4 text-gray-500">{isDialogUpdate()
            ? "Compila il form seguente per modificare la categoria selezionata"
            : "Compila il form seguente per aggiungere una nuova categoria alla tua collezione"}</p>
      <hr class="bg-gray-400 mx-4"></hr>
      <DialogContent>
        <DialogContentText>
          
        </DialogContentText>
        <Stack
          component="form"
          noValidate
          sx={{ mt: 1 }}
          onSubmit={handleSubmit(onSubmit)}
          spacing={1}
          direction={"column"}
         
        >
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
          <div className="h-[1]" />
          <div className='flex text-sm font-medium relative bg-gray-100 p-3 rounded-lg py-3 '>
                <a onClick={() => {setActiveTab(0), setValue(0)}} className={`cursor-pointer button z-10 w-full px-2 py-1 ${activeTab === 0 ? '' : ''}`}>Generale</a>
                <a onClick={() => {setActiveTab(1), setValue(1)}} className={`cursor-pointer button z-10 w-full px-2 py-1 rounded-lg ${activeTab === 1 ? '' : ''}`}>Stati</a>
                <a onClick={() => {setActiveTab(2), setValue(2)}} className={`cursor-pointer button z-10 w-full px-2 py-1 ${activeTab === 2 ? '' : ''}`}>Articolo</a>
                <a onClick={() => {setActiveTab(3), setValue(3)}} className={`cursor-pointer button z-10 w-full px-2 py-1 ${activeTab === 3 ? '' : ''}`}>Tags</a>
                <a onClick={() => {setActiveTab(4), setValue(4)}} className={`cursor-pointer button z-10 w-full px-2 py-1 ${activeTab === 4 ? '' : ''}`}>Periodo</a>
                <a onClick={() => {setActiveTab(5), setValue(5)}} className={`cursor-pointer button z-10 w-full px-2 py-1 ${activeTab === 5 ? '' : ''}`}>Rateo</a>

                <div className='absolute items-center px-1 top-0 left-0 w-full h-full flex'>
                <motion.div
                    // Animate x to the correct position based on the active tab index
                    animate={{
                      x: activeTab === 0 ? 0 : activeTab === 1? '100%' : activeTab === 2 ? '200%' : activeTab === 3 ? '300%' : activeTab === 4 ? '400%' : '500%',
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="w-1/6 bg-white border h-7 rounded-lg"
                  />
                </div>
               
            </div>
            {/* <Tabs value={value} onChange={handleTabChange} >
              <Tab label={<button class="z-10 w-full px-2 py-1 ">Generale</button>} />
              <Tab label="Stati" />
              <Tab label="Articolo" />
              <Tab label="Tags" />
              <Tab label="Periodo" />
              <Tab label="Rateo" />
            </Tabs> */}
            <div className="h-[1]" />
          
          <div className="h-[25vh]" >
          
          <TabFiltroDialog value={value} index={0} >
            <MyReactSelect
              control={control}
              name="idStabilimento"
              label="Stabilimento"
              options={stabilimentiList}
              menuPosition="fixed"
              styles={selectStyles}
            />
            {tipologiaReclamoList ? (
              <MyReactSelect
                control={control}
                name="idTipologiaReclamo"
                label="Tipologia reclamo (facoltativo)"
                options={tipologiaReclamoList}
                menuPosition="fixed"
                styles={selectStyles}
              />
            ) : (
              <></>
            )}
            <MyReactSelect
              control={control}
              name="cliente"
              label="Cliente (facoltativo)"
              options={clientiList}
              menuPosition="fixed"
              styles={selectStyles}
              
            />
            <Controller

              control={control}
              name={"pinned"}
              render={({ field: { onChange, value } }) => (
                <FormControlLabel
                className="pt-8"
                  control={<Checkbox icon={<Record className={ value ? "text-secondary " : "text-primary  "} />} checkedIcon={<TickCircle className={ value ? "text-secondary " : "text-primary  "} variant="Bold" />} checked={value} onChange={onChange} />}
                  label={<p className={ value ? "text-secondary " : "text-primary  "}>Fissa in alto</p>}
                />
              )}
            />
          </TabFiltroDialog>
          <TabFiltroDialog value={value} index={1}>
            <MyReactSelect
              control={control}
              name="aperto"
              label="Stato reclamo(facoltativo)"
              options={statiList}
              menuPosition="fixed"
              styles={selectStyles}
            />
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
          </TabFiltroDialog>
          <TabFiltroDialog value={value} index={2}>
            <TextField
              {...register("descrizioneArticoloContiene")}
              size="small"
              margin="normal"
              fullWidth
              id="descrizioneArticoloContiene"
              label="La descrizione contiene"
              name="descrizioneArticoloContiene"
              error={!!errors.descrizioneArticoloContiene}
              helperText={errors.descrizioneArticoloContiene?.message}
              type="text"
            />
            <TextField
              {...register("descrizioneArticoloNonContiene")}
              size="small"
              margin="normal"
              fullWidth
              id="descrizioneArticoloNonContiene"
              label="La descrizione non contiene"
              name="descrizioneArticoloNonContiene"
              error={!!errors.descrizioneArticoloNonContiene}
              helperText={errors.descrizioneArticoloNonContiene?.message}
              type="text"
            />
          </TabFiltroDialog>
          <TabFiltroDialog value={value} index={3}>
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
          </TabFiltroDialog>
          <TabFiltroDialog value={value} index={4}>
            <Controller
              control={control}
              name={"timestampCreazioneAttivo"}
              render={({ field: { onChange, value } }) => (
                <FormControlLabel
                className="pt-8"
                checked={value}
                  control={<Checkbox value={value} icon={<Record className={ value ? "text-secondary " : "text-primary  "} />} checkedIcon={<TickCircle className={ value ? "text-secondary " : "text-primary  "} variant="Bold" />} checked={value} onChange={(e) => {
                    setValueForm(
                      "timestampCreazioneAttivo",
                      e.target.checked
                    );
                    if (!e.target.checked) {
                      setValueForm("timestampCreazioneDa", null);
                      setValueForm("timestampCreazioneA", null);
                    }
                  }} />}
                  label={<p className={ value ? "text-secondary " : "text-primary  "}>Filtro per data apertura</p>}
                />
               
              )}
            />
            {watch("timestampCreazioneAttivo") ? (
              <Stack direction={"row"} spacing={1}>
                <Controller
                  name="timestampCreazioneDa"
                  control={control}
                  defaultValue={null}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <DatePicker
                      label="Da"
                      format="DD/MM/YYYY"
                      value={dayjs(value)}
                      control={control}
                      onChange={(event) => onChange(event)}
                      slotProps={{
                        textField: {
                          error: !!error,
                          helperText: error?.message,
                          size: "small",
                        },
                      }}
                    />
                  )}
                />
                <Controller
                  name="timestampCreazioneA"
                  control={control}
                  defaultValue={null}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <DatePicker
                      label="A"
                      format="DD/MM/YYYY"
                      value={dayjs(value)}
                      control={control}
                      onChange={(event) => onChange(event)}
                      slotProps={{
                        textField: {
                          error: !!error,
                          helperText: error?.message,
                          size: "small",
                        },
                      }}
                    />
                  )}
                />
              </Stack>
            ) : null}
            <Controller
              control={control}
              name={"timestampChiusuraAttivo"}

              render={({ field: { onChange, value } }) => (
                <FormControlLabel
                className="pt-8"
               
                  control={<Checkbox value={value} icon={<Record className={ value ? "text-secondary " : "text-primary  "} />} checkedIcon={<TickCircle className={ value ? "text-secondary " : "text-primary  "} variant="Bold" />} checked={value} onChange={(e) => {
                    setValueForm(
                      "timestampChiusuraAttivo",
                      e.target.checked
                    );
                    if (!e.target.checked) {
                      setValueForm("timestampChiusuraDa", null);
                      setValueForm("timestampChiusuraA", null);
                    }
                  }} />}
                  label={<p className={ value ? "text-secondary " : "text-primary  "}>Filtro per data apertura</p>}
                />
    
              )}
            />
            {watch("timestampChiusuraAttivo") ? (
              <Stack direction={"row"} spacing={1}>
                <Controller
                  name="timestampChiusuraDa"
                  control={control}
                  defaultValue={null}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <DatePicker
                      label="Da"
                      format="DD/MM/YYYY"
                      value={dayjs(value)}
                      control={control}
                      onChange={(event) => onChange(event)}
                      slotProps={{
                        textField: {
                          error: !!error,
                          helperText: error?.message,
                          size: "small",
                        },
                      }}
                    />
                  )}
                />
                <Controller
                  name="timestampChiusuraA"
                  control={control}
                  defaultValue={null}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <DatePicker
                      label="A"
                      format="DD/MM/YYYY"
                      value={dayjs(value)}
                      control={control}
                      onChange={(event) => onChange(event)}
                      slotProps={{
                        textField: {
                          error: !!error,
                          helperText: error?.message,
                          size: "small",
                        },
                      }}
                    />
                  )}
                />
              </Stack>
            ) : null}
          </TabFiltroDialog>
          <TabFiltroDialog value={value} index={5}>
            <Controller
              control={control}
              name={"rateoAttivo"}
              render={({ field: { onChange, value } }) => (
                <FormControlLabel
                className="pt-8"
               
                  control={<Checkbox value={value} icon={<Record className={ value ? "text-secondary " : "text-primary  "} />} checkedIcon={<TickCircle className={ value ? "text-secondary " : "text-primary  "} variant="Bold" />} checked={value} onChange={(e) => {
                    setValueForm(
                      "rateoAttivo",
                      e.target.checked
                    );
                    if (!e.target.checked) {
                      setValueForm("rateo", null);
                      setValueForm("annoRateo", null);
                    }
                  }} />}
                  label={<p className={ value ? "text-secondary " : "text-primary  "}>Filtro per rateo</p>}
                />
                        
              )}
            />
            {watch("rateoAttivo") ? (
              <Stack direction={"column"} spacing={1} width={"100%"}>
                <MyReactSelect
                  control={control}
                  name="rateo"
                  label="Includi nel rateo"
                  options={rateoOptions}
                  menuPortalTarget={document.body}
                  styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  }}
                  menuPosition={"fixed"}
                />
                <TextField
                  {...register("annoRateo")}
                  size="small"
                  margin="normal"
                  fullWidth
                  id="annoRateo"
                  label="Esercizio rateo"
                  name="annoRateo"
                  error={!!errors.annoRateo}
                  helperText={errors.annoRateo?.message}
                  type="number"
                />
              </Stack>
            ) : null}
          </TabFiltroDialog>
          </div>
          <Stack direction={"row-reverse"} spacing={2}>
            <button type="submit" className="h-8 gap-1 bg-primary hidden py-1 px-4 duration-200 text-white rounded-lg text-sm md:flex items-center justify-center" variant="contained">
              {isDialogUpdate() ? "Aggiorna" : "Aggiungi"} 
            </button>
            <button className="text-red-500 text-sm pr-2" onClick={() => onCloseDialog()}>Annulla</button>
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions></DialogActions>
    </Dialog>
  );
}
