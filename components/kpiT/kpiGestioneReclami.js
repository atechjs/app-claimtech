import { Box, CircularProgress, Typography } from "@mui/material";
import { useEffect } from "react";

import DatasetIcon from "@mui/icons-material/Dataset";
import Sezione from "./sezione";
import CardsNumerositaReclami from "./cardsNumerositaReclami";
import useGestioneReclami from "../fetching/useGestioneReclami";
import KpiLayout from "./kpiLayout";
import SezioneTempiGenerica from "./sezioneTempiGenerica";
import CardGrafico from "./cards/cardGrafico";
import {
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
} from "recharts";
import MUIDataTable from "mui-datatables";
import { getTraduzioneTabella } from "../my-mui-data-table/traduzioneTabella";
export default function KpiGestioneReclami({ isActive, filterValues }) {
  useEffect(() => {
    chiamataABe();
  }, [isActive, filterValues]);

  const { data, trigger, isMutating } = useGestioneReclami();

  const chiamataABe = () => {
    if (!isActive) return;
    trigger(filterValues);
  };

  if (!data || isMutating)
    return (
      <Box width={"100%"}>
        <CircularProgress />
      </Box>
    );
  const traduzione = getTraduzioneTabella();
  return (
    <KpiLayout titolo={"KPI Gestione Reclami"}>
      <Sezione
        label={"Numerosità reclami"}
        icon={<DatasetIcon color="primary" fontSize="medium" />}
        subsection
      >
        <CardsNumerositaReclami data={data.numerositaReclamiList} />
        <CardGrafico title={"Reclami chiusi vs Totale"}>
          <ResponsiveContainer width="100%" height="100%" aspect={5}>
            <BarChart
              width={500}
              height={300}
              data={data.gestioneReclamiData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mese" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="totale"
                stackId="b"
                fill="#8884d8"
                background={{ fill: "#eee" }}
              />
              <Bar dataKey="chiusi" stackId="a" fill="#82ca9d" />
              <Bar dataKey="rimasti_aperti" stackId="a" fill="#f52c2c" />
            </BarChart>
          </ResponsiveContainer>
        </CardGrafico>
        <MUIDataTable
          data={data.gestioneReclamiData}
          columns={["mese", "totale", "chiusi", "rimasti_aperti"]}
          options={{
            selectableRows: false,
            textLabels: traduzione,
            rowsPerPage: 100,
          }}
        />
      </Sezione>
      <SezioneTempiGenerica
        titolo="Tempi di chiusura"
        descrizione="Il tempo di gestione reclami è calcolato usando la data di ricezione prima mail
          del reclamo e la data di chiusura."
        dataList={data.dataList}
        minTempo={data.minTempo}
        maxTempo={data.maxTempo}
        avgTempo={data.avgTempo}
      />
    </KpiLayout>
  );
}
