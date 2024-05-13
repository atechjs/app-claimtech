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
  LabelList,
} from "recharts";
import MUIDataTable from "mui-datatables";
import { getTraduzioneTabella } from "../my-mui-data-table/traduzioneTabella";
import { GestioneReclamiCustomTooltip } from "../charts/gestioneReclamiCustomTooltip/GestioneReclamiCustomTooltip";
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
              <Tooltip
                content={<GestioneReclamiCustomTooltip />}
                cursor={{ fill: "transparent" }}
              />
              <Legend />
              <Bar
                dataKey="chiusi_questo_mese"
                stackId="a"
                fill="#82ca9d"
                name="Chiusi"
              />
              <Bar
                dataKey="aperti_questo_mese"
                stackId="b"
                fill="#03dbfc"
                name="Aperti questo mese"
              />
              <Bar
                dataKey="di_cui_dal_mese_precedente"
                stackId="b"
                fill="#fcdb03"
                name="Aperti il mese precedente"
              />
              <Bar
                dataKey="di_cui_rateo"
                stackId="b"
                fill="#fc6b03"
                name="Aperti da più di un mese (a rateo)"
              />
              <Bar
                dataKey="di_cui_da_piu_di_un_mese"
                stackId="b"
                fill="#fc2403"
                name="Aperti da più di un mese (NO rateo)"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardGrafico>
        <MUIDataTable
          data={data.gestioneReclamiData}
          columns={[
            { name: "mese", label: "Mese" },
            { name: "aperti_questo_mese", label: "Ap. del mese" },
            { name: "chiusi_questo_mese", label: "Chiusi" },
            { name: "aperti_inizio_mese", label: "Ap. ini mese" },
            { name: "di_cui_dal_mese_precedente", label: "Ap. mes pre" },
            { name: "di_cui_da_piu_di_un_mese", label: "Ap. >= 2 NR" },
            { name: "di_cui_rateo", label: "Ap. >= 2 Rateo" },
            { name: "rimasti_aperti_questo_mese", label: "Rimasti Aperti" },
            { name: "totale", label: "Totale" },
          ]}
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
