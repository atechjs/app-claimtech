import React from "react";
import Layout from "../../components/layout";
import { getTraduzioneTabella } from "../../components/my-mui-data-table/traduzioneTabella";
import GenericSearchRender from "../../components/my-mui-data-table/genericSearchRender";
import ToolbarPulsanteAggiungi from "../../components/my-mui-data-table/ToolbarPulsanteAggiungi";
import { useTableStateSaver } from "../../components/my-mui-data-table/useTableStateSaver";
import { Box } from "@mui/material";
import MUIDataTable from "mui-datatables";
import { useRouter } from "next/router";
import useAllUtenti from "../../components/fetching/useAllUtenti";

export default function Page() {
  const [state, actionSalvataggio] = useTableStateSaver();
  const { utenteList, error, isLoading } = useAllUtenti();
  const router = useRouter();

  function openRecord(id) {
    actionSalvataggio.mantieni();
    router.push("/utenti/" + id);
  }

  function clickButtonNuovo() {
    actionSalvataggio.mantieni();
    router.push("/utenti/nuovo");
  }

  const traduzione = getTraduzioneTabella();
  const tableOptions = {
    filter: true,
    filterType: "dropdown",
    downloadOptions: {
      filename: "utenti.csv",
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
      name: "username",
      label: "Username",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "nome",
      label: "Nome",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "cognome",
      label: "Cognome",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "mail",
      label: "Mail",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "ruolo",
      label: "Ruolo",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "stabilimento",
      label: "Stabilimento",
      options: {
        filter: true,
        sort: true,
      },
    },
  ];

  return (
    <Box p={2}>
      <MUIDataTable
        title={"Utenti registrati"}
        columns={columns}
        options={tableOptions}
        data={utenteList}
      />
    </Box>
  );
}

Page.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
