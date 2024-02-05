import {
  Autocomplete,
  Box,
  CircularProgress,
  Container,
  FormGroup,
  FormLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Layout from "../../components/layout";
import { useEffect, useState } from "react";
import MenuFiltri from "../../components/kpiT/menuFiltri";
import dayjs from "dayjs";
import KpiGestioneReclami from "../../components/kpiT/kpiGestioneReclami";
import KpiFaseAnalisi from "../../components/kpiT/kpiFaseAnalisi";
import KpiApprovazioneGestione from "../../components/kpiT/kpiApprovazioneGestione";
import KpiEmissioneNotaAccredito from "../../components/kpiT/kpiEmissioneNotaAccredito";
import KpiFragment from "../../components/kpiT/kpiFragment";

export default function Page() {
  function vhToPixels(vh) {
    return Math.round(window.innerHeight / (100 / vh));
  }
  const [indexSelezionato, setIndexSelezionato] = useState(0);
  const [filterValues, setFilterValues] = useState({
    periodo: 0,
    idStabilimento: 1,
  });
  const kpiList = [
    { id: 0, label: "GESTIONE RECLAMI" },
    { id: 1, label: "FASE DI ANALISI" },
    { id: 2, label: "APPROVAZIONE GESTIONE" },
    { id: 3, label: "EMISSIONE NOTA ACCREDITO" },
  ];

  const onKpiSelected = (filtro) => {
    setIndexSelezionato(filtro.id);
  };

  const onSync = (values) => {
    setFilterValues(values);
  };

  return (
    <Stack
      sx={{
        minHeight: vhToPixels(100) - 64 + "px",
        width: "100%",
      }}
      spacing={1}
      direction={"row"}
      p={1}
      m={0}
    >
      <MenuFiltri
        filtroSelezionato={indexSelezionato}
        filterList={kpiList}
        isLoading={false}
        onFilterSelected={onKpiSelected}
        onSync={onSync}
        filterValues={filterValues}
      />
      <>
        <KpiFragment id={0} value={indexSelezionato}>
          <KpiGestioneReclami
            isActive={0 === indexSelezionato}
            filterValues={filterValues}
          />
        </KpiFragment>
        <KpiFragment id={1} value={indexSelezionato}>
          <KpiFaseAnalisi
            isActive={1 === indexSelezionato}
            filterValues={filterValues}
          />
        </KpiFragment>
        <KpiFragment id={2} value={indexSelezionato}>
          <KpiApprovazioneGestione
            isActive={2 === indexSelezionato}
            filterValues={filterValues}
          />
        </KpiFragment>
        <KpiFragment id={3} value={indexSelezionato}>
          <KpiEmissioneNotaAccredito
            isActive={3 === indexSelezionato}
            filterValues={filterValues}
          />
        </KpiFragment>
      </>
    </Stack>
  );
}
Page.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
