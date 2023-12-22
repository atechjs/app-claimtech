import React from "react";
import Layout from "../../components/layout";
import { getTraduzioneTabella } from "../../components/my-mui-data-table/traduzioneTabella";
import GenericSearchRender from "../../components/my-mui-data-table/genericSearchRender";
import ToolbarPulsanteAggiungi from "../../components/my-mui-data-table/ToolbarPulsanteAggiungi";
import { useTableStateSaver } from "../../components/my-mui-data-table/useTableStateSaver";
import { Box } from "@mui/material";
import MUIDataTable from "mui-datatables";
import { useRouter } from "next/router";
import useAllWorkflowsGestioneReclamo from "../../components/fetching/useAllWorkflowsGestioneReclamo";
import useAllTipologieAnalisi from "../../components/fetching/useAllTipologieAnalisi";

export default function Page() {
  const [state, actionSalvataggio] = useTableStateSaver();
  const { dataList } = useAllTipologieAnalisi();
  const router = useRouter();

  function openRecord(id) {
    actionSalvataggio.mantieni();
    router.push("/tipologieAnalisi/" + id);
  }

  function clickButtonNuovo() {
    actionSalvataggio.mantieni();
    router.push("/tipologieAnalisi/nuovo");
  }

  const traduzione = getTraduzioneTabella();
  const tableOptions = {
    filter: true,
    filterType: "dropdown",
    downloadOptions: {
      filename: "tipologie_analisi.csv",
      separator: ",",
      filterOptions: {
        useDisplayedColumnsOnly: true,
        useDisplayedRowsOnly: true,
      },
    },
    selectableRows: "none",
    searchText: state.text,
    page: state.page ? state.page : 0,
    sortOrder: state.ordinamento,
    rowsPerPage: 50,
    rowsPerPageOptions: [50, 100, 500, 1000, 1500, 5000, 10000, 20000],
    elevation: 4,
    searchOpen: false,
    textLabels: traduzione,
    customSearchRender: GenericSearchRender(300),
    customToolbar: () => {
      return <ToolbarPulsanteAggiungi onAddClick={clickButtonNuovo} />;
    },
    onFilterChange: (columnChanged, filterList) => {
      actionSalvataggio.salvaFilterList(filterList);
    },
    onSearchChange: (text) => {
      actionSalvataggio.salvaText(text);
    },
    onChangePage: (currentPage) => {
      actionSalvataggio.salvaPagina(currentPage);
    },
    setRowProps: (row, dataIndex) => ({
      onDoubleClick: () => {
        openRecord(row[0]);
      },
    }),
  };

  const columns = [
    {
      name: "id",
      label: "id",
      options: {
        filter: false,
        sort: true,
        display: false,
      },
    },
    {
      name: "codice",
      label: "Codice",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "descrizione",
      label: "Descrizione",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "descrizioneInglese",
      label: "Traduzione",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "um",
      label: "Unità di misura",
      options: {
        filter: true,
        sort: true,
      },
    },
  ];

  return (
    <Box p={2}>
      <MUIDataTable
        title={"Tipologie analisi registrate"}
        columns={columns}
        options={tableOptions}
        data={dataList}
      />
    </Box>
  );
}

Page.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
