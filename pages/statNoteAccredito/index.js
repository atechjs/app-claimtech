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
import useValutaSelect from "../../components/fetching/useValutaSelect";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import useGetStatNc from "../../components/fetching/statistiche/useGetStatNc";
import CardStatoFornitura from "../../components/statNoteAccredito/cards/cardStatoFornitura";
import CardGrafico from "../../components/statNoteAccredito/cards/cardGrafico";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import InputPeriodo from "../../components/statNoteAccredito/inputs/inputPeriodo";
import InputSelect from "../../components/statNoteAccredito/inputs/inputSelect";
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
      raggruppamento: getValues("raggruppamento"),
    });
  };
  const { valutaList } = useValutaSelect(onValuteCaricate);
  const raggruppamentoList = [
    { label: "PER MESE", value: "MESE" },
    { label: "PER ANNO", value: "ANNO" },
  ];
  const form = useForm({
    defaultValues: {
      dataInizio: dayjs().add(-1, "M").startOf("month"),
      dataFine: dayjs().add(-1, "M").endOf("month"),
      idValuta: null,
      raggruppamento: "MESE",
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

  const creaCardTotale = (list) => {
    const count = list.reduce((accumulator, object) => {
      return accumulator + object.count;
    }, 0);
    const sum = list.reduce((accumulator, object) => {
      return accumulator + object.sum;
    }, 0);
    return <CardStatoFornitura data={{ codice: "TOTALE", count, sum }} />;
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
        <InputSelect
          name="idValuta"
          label={"Valuta considerata*"}
          control={control}
          options={valutaList}
        />
        <InputSelect
          name="raggruppamento"
          label={"Raggruppamento*"}
          control={control}
          options={raggruppamentoList}
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
        <Stack direction={"column"} width={"100%"} spacing={1}>
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
              <Paper>
                <Stack
                  width={"100%"}
                  p={1}
                  justifyContent="center"
                  alignItems="center"
                  spacing={1}
                >
                  <Typography variant="button">
                    Situazione cause reclamo(considerando{" "}
                    {
                      valutaList.find((x) => x.value === getValues("idValuta"))
                        .label
                    }{" "}
                    come valuta)
                  </Typography>
                  <Stack
                    direction="row"
                    justifyContent="space-evenly"
                    alignItems="stretch"
                    spacing={1}
                  >
                    {statData.statoList.map((data) => (
                      <CardStatoFornitura data={data} />
                    ))}
                    {creaCardTotale(statData.statoList)}
                  </Stack>
                </Stack>
              </Paper>
            </Stack>
          </Stack>
          <Stack direction={"row"} spacing={1} width={"100%"}>
            <Box width={"100%"}>
              <CardGrafico title={"Andamento euro note accredito emesse"}>
                <ResponsiveContainer width="100%" height="100%" aspect={5}>
                  <AreaChart
                    width={500}
                    height={200}
                    data={statData.notaAccreditoDataList}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <defs>
                      <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="#82ca9d"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#82ca9d"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="sum"
                      stroke="#82ca9d"
                      fillOpacity={1}
                      fill="url(#colorUv)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardGrafico>
            </Box>
          </Stack>
        </Stack>
      )}
    </Stack>
  );
}

Page.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
