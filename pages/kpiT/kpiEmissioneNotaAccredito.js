import { useEffect } from "react";
import KpiLayout from "../../components/kpiT/kpiLayout";
import SezioneTempiGenerica from "../../components/kpiT/sezioneTempiGenerica";
import { Box, CircularProgress } from "@mui/material";
import useEmissioneNotaAccredito from "../../components/fetching/useEmissioneNotaAccredito";

export default function KpiEmissioneNotaAccredito({ isActive, filterValues }) {
  useEffect(() => {
    chiamataABe();
  }, [isActive, filterValues]);
  const { data, trigger, isMutating } = useEmissioneNotaAccredito();
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
    <KpiLayout titolo={"KPI emissione note accredito"}>
      <SezioneTempiGenerica
        titolo="Tempi di emissione note accredito"
        descrizione="Il tempo di emissione nota accredito è dato dalla differenza tra l'autorizzazione e l'emissione effettiva."
        minTempo={data.minTempo}
        maxTempo={data.maxTempo}
        avgTempo={data.avgTempo}
      />
    </KpiLayout>
  );
}
