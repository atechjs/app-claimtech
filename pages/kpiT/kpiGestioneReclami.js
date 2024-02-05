import { Box, CircularProgress, Typography } from "@mui/material";
import { useEffect } from "react";

import DatasetIcon from "@mui/icons-material/Dataset";
import Sezione from "./sezione";
import CardsNumerositaReclami from "../../components/kpiT/cardsNumerositaReclami";
import useGestioneReclami from "../../components/fetching/useGestioneReclami";
import KpiLayout from "../../components/kpiT/kpiLayout";
import SezioneTempiGenerica from "../../components/kpiT/sezioneTempiGenerica";
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
  return (
    <KpiLayout titolo={"KPI Gestione Reclami"}>
      <Sezione
        label={"Numerosità reclami"}
        icon={<DatasetIcon color="primary" fontSize="medium" />}
        subsection
      >
        <CardsNumerositaReclami data={data.numerositaReclamiList} />
      </Sezione>
      <SezioneTempiGenerica
        titolo="Tempi di chisura"
        descrizione="Il tempo di gestione reclami è calcolato usando la data di apertura
          del reclamo e la data di chiusura."
        minTempo={data.minTempo}
        maxTempo={data.maxTempo}
        avgTempo={data.avgTempo}
      />
    </KpiLayout>
  );
}
