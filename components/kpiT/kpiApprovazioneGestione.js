import { useEffect } from "react";
import KpiLayout from "./kpiLayout";
import useFaseAnalisi from "../fetching/useFaseAnalisi";
import SezioneTempiGenerica from "./sezioneTempiGenerica";
import { Box, CircularProgress } from "@mui/material";
import useApprovazioneGestione from "../fetching/useApprovazioneGestione";

export default function KpiApprovazioneGestione({ isActive, filterValues }) {
  useEffect(() => {
    chiamataABe();
  }, [isActive, filterValues]);
  const { data, trigger, isMutating } = useApprovazioneGestione();
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
  return (
    <KpiLayout titolo={"KPI Approvazione della gestione del reclamo"}>
      <SezioneTempiGenerica
        titolo="Tempi di approvazione della proposta TCS"
        descrizione="Il tempo di approvazione della proposta TCS è dato dalla differenza tra
        la creazione della proposta e la sua conferma a sistema."
        dataList={data.dataList}
        minTempo={data.minTempo}
        maxTempo={data.maxTempo}
        avgTempo={data.avgTempo}
      />
    </KpiLayout>
  );
}
