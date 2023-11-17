import React, { useEffect } from "react";
import Layout from "../../components/layout";
import {
  Box,
  Button,
  Card,
  Divider,
  Grid,
  LinearProgress,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import InputPeriodo from "./inputs/inputPeriodo";
import InputValuta from "./inputs/inputValuta";
import useValutaSelect from "../../components/fetching/useValutaSelect";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import useGetStatNc from "../../components/fetching/statistiche/useGetStatNc";
export default function Page() {
  const { data: statData, trigger, isMutating } = useGetStatNc();

  const onValuteCaricate = (values) => {
    const idValuta = values.find((x) => x.label === "EUR").value;
    setValue("idValuta", idValuta);
    //Chiamata a frontend per ottenere i dati
    trigger({
      dataInizio: getValues("dataInizio"),
      dataFine: getValues("dataFine"),
      idValuta: idValuta,
    });
  };
  const { valutaList } = useValutaSelect(onValuteCaricate);
  const form = useForm({
    defaultValues: {
      dataInizio: dayjs().add(-1, "M").startOf("month"),
      dataFine: dayjs().add(-1, "M").endOf("month"),
      idValuta: null,
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

  const onFormSubmit = (values) => {
    trigger(values);
  };
  return (
    <Stack direction={"column"} width={"100%"} spacing={2} p={2}>
      <Typography variant="h6">Report note accredito</Typography>
      <Stack
        direction={"row"}
        spacing={1}
        component="form"
        noValidate
        onSubmit={handleSubmit(onFormSubmit)}
      >
        <InputPeriodo
          name="dataInizio"
          label={"Inizio periodo*"}
          control={control}
        />
        <InputPeriodo
          name="dataFine"
          label={"Fine periodo*"}
          control={control}
        />
        <InputValuta
          name="idValuta"
          label={"Valuta considerata*"}
          control={control}
          options={valutaList}
        />
        <Button
          type="submit"
          variant="contained"
          size="small"
          startIcon={<FilterAltIcon />}
          disabled={isMutating}
        >
          Filtra
        </Button>
      </Stack>
      {statData === undefined ? (
        <></>
      ) : isMutating ? (
        <LinearProgress />
      ) : (
        <>
          <Stack direction={"row"} width={"100%"} spacing={1}>
            <Paper>
              <Stack
                direction={"column"}
                width={"100%"}
                p={1}
                divider={<Divider />}
                spacing={2}
              >
                <Stack
                  direction={"column"}
                  justifyContent="center"
                  alignItems="center"
                >
                  <Typography variant="button">
                    Numero di note accredito emesse
                  </Typography>
                  <Typography variant="h5">
                    <b>{statData.countNc}</b>
                  </Typography>
                </Stack>
                <Stack
                  direction={"column"}
                  justifyContent="center"
                  alignItems="center"
                >
                  <Typography variant="button">
                    Somma euro note accredito
                  </Typography>
                  <Typography variant="h5">
                    <b>{statData.totaleValoriEuroNc}</b>
                  </Typography>
                </Stack>
              </Stack>
            </Paper>
            <Stack direction={"column"} width={"100%"} spacing={1}>
              <Grid container spacing={1}>
                {statData.faseList.map((data) => {
                  const sum = data.tipologiaList.reduce(
                    (accumulator, object) => {
                      return accumulator + object.count;
                    },
                    0
                  );
                  return (
                    <Grid item xs={6}>
                      <Card>
                        <Stack direction={"row"}>
                          <Box
                            bgcolor={data.codice === "APERTI" ? "green" : "red"}
                            width={"10px"}
                          />
                          <Stack
                            direction={"column"}
                            justifyContent="center"
                            alignItems="center"
                            width={"100%"}
                          >
                            <Typography variant="button">
                              Numero di reclami {data.codice}
                            </Typography>
                            <Typography variant="h3">
                              <b>{sum}</b>
                            </Typography>
                            <Typography variant="caption">Di cui</Typography>
                            <Stack direction={"row"} spacing={1} pb={0.5}>
                              {data.tipologiaList.map((tip, index) => (
                                <>
                                  <Typography variant="button">
                                    {tip.codice}
                                  </Typography>
                                  <Typography>
                                    <b>{tip.count}</b>
                                  </Typography>
                                  {index < data.tipologiaList.length - 1 ? (
                                    <Divider orientation="vertical" flexItem />
                                  ) : null}
                                </>
                              ))}
                            </Stack>
                          </Stack>
                        </Stack>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
              <Stack
                direction="row"
                justifyContent="space-evenly"
                alignItems="stretch"
                spacing={1}
              >
                {statData.statoList.map((data) => (
                  <Card>
                    <Stack direction={"column"} p={1}>
                      <Typography variant="button" color={"primary"}>
                        {data.codice}
                      </Typography>
                      <Typography variant="button">
                        Numero: <b>{data.count}</b>
                      </Typography>
                      <Typography variant="button">
                        Valore totale: <b>{data.sum}</b>
                      </Typography>
                    </Stack>
                  </Card>
                ))}
              </Stack>
            </Stack>
          </Stack>
        </>
      )}
    </Stack>
  );
}

Page.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
