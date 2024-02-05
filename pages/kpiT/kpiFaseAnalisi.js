import { useEffect } from "react";
import KpiLayout from "../../components/kpiT/kpiLayout";
import useFaseAnalisi from "../../components/fetching/useFaseAnalisi";
import SezioneTempiGenerica from "../../components/kpiT/sezioneTempiGenerica";
import { Box, CircularProgress } from "@mui/material";

export default function KpiFaseAnalisi({ isActive, filterValues }) {
  useEffect(() => {
    chiamataABe();
  }, [isActive, filterValues]);
  const { data, trigger, isMutating } = useFaseAnalisi();
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
    <KpiLayout titolo={"KPI Fase di analisi reclamo"}>
      <SezioneTempiGenerica
        titolo="Tempi di analisi reclamo"
        descrizione="Il tempo di analisi di un reclamo è dato dalla differenza tra
        l'apertura del reclamo e la creazione della proposta TCS."
        minTempo={data.minTempo}
        maxTempo={data.maxTempo}
        avgTempo={data.avgTempo}
      />
    </KpiLayout>
  );
}
