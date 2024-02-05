import { useEffect } from "react";
import KpiLayout from "../../components/kpiT/kpiLayout";
import useFaseAnalisi from "../../components/fetching/useFaseAnalisi";
import SezioneTempiGenerica from "../../components/kpiT/sezioneTempiGenerica";
import { Box, CircularProgress } from "@mui/material";
import useApprovazioneGestione from "../../components/fetching/useApprovazioneGestione";

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
        minTempo={data.minTempo}
        maxTempo={data.maxTempo}
        avgTempo={data.avgTempo}
      />
    </KpiLayout>
  );
}
