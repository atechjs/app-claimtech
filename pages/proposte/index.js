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
import MenuFiltri from "../../components/proposta/menuFiltri";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import useProposteAssegnate from "../../components/fetching/useProposteAssegnate";
import MUIDataTable from "mui-datatables";
import { useTableStateSaverV2 } from "../../components/my-mui-data-table/useTableStateSaverV2";
import { getTraduzioneTabella } from "../../components/my-mui-data-table/traduzioneTabella";
import GenericSearchRender from "../../components/my-mui-data-table/genericSearchRender";
import RenderDatiReclamo from "../../components/my-mui-data-table/components/renderDatiReclamo";
import autocompleteCustomFilterListOptions from "../../components/my-mui-data-table/autocompleteCustomFilterListOptions";
import autocompleteFilterOption from "../../components/my-mui-data-table/autocompleteFilterOption";
import useClienteSelect from "../../components/fetching/useClienteSelect";
import dayjs from "dayjs";
import ValueWithIcon from "../../components/my-mui-data-table/valueWithIcon";
import { getCodiciArticoloUnivoci } from "../../utils/articoloUtils";
import { DateField } from "@mui/x-date-pickers";
import useCausaSelect from "../../components/fetching/useCausaSelect";
import { getCodiciCausaUnivoci } from "../../utils/causaUtils";
import { getNumList, getPartiteUnivoche } from "../../utils/OdlUtils";
import RenderDatiArticoloValorizzazione from "../../components/my-mui-data-table/components/renderDatiArticoloValorizzazione";
import DialogModificaProposta from "../../components/proposta/dialogModificaProposta";
import getApiUrl from "../../utils/BeUrl";

export default function Page() {
  const [idFiltroSelezionatoInterno, setIdFiltroSelezionatoInterno] =
    useState(1);
  const [fetch, setFetch] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { query, isReady } = router;
  const [state, actionSalvataggio] = useTableStateSaverV2();
  const { clientiList: optionsClienti } = useClienteSelect();
  const { causaList } = useCausaSelect();
  const [idPropostaAperta, setIdPropostaAperta] = useState(undefined);

  useEffect(() => {
    if (!isReady) return;
    setFetch(true);
    actionSalvataggio.createIntialState(router, searchParams, pathname);
    setIdPropostaAperta(query["idPropostaAperta"]);
  }, [isReady]);

  const onDataSuccess = (data) => {
    setIdFiltroSelezionatoInterno(data.idFiltroSelezionato);
  };

  const { filtriList, proposteList, mutate, isLoading, error } =
    useProposteAssegnate(fetch, query, onDataSuccess);

  function setParam(key, value) {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set(key, value);
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`${pathname}${query}`);
  }

  function deleteParam(key) {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.delete(key);
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`${pathname}${query}`);
  }

  const onFilterSelected = (values) => {
    const id = values.id;
    setParam("idFiltroSelezionato", id);
    setIdFiltroSelezionatoInterno(values.id);
  };

  function vhToPixels(vh) {
    return Math.round(window.innerHeight / (100 / vh));
  }

  function setParamList(paramList) {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    paramList.forEach((element) => {
      current.set(element.key, element.value);
    });
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`${pathname}${query}`);
  }

  function mantieni() {
    const paramList = [
      { key: "filterList", value: JSON.stringify(state.filterList) },
      { key: "text", value: state.text !== null ? state.text : "" },
      { key: "page", value: JSON.stringify(state.page) },
      { key: "ordinamento", value: JSON.stringify(state.ordinamento) },
    ];
    setParamList(paramList);
  }

  const onSyncMenu = () => {
    mutate(getApiUrl() + "api/proposta/proposteAssegnate");
  };

  const apriPropostaTable = (id) => {
    setParam("idPropostaAperta", id);
    setIdPropostaAperta(id);
  };

  const chiudiProposta = () => {
    deleteParam("idPropostaAperta");
    setIdPropostaAperta(undefined);
  };

  const handleSubmitModifica = () => {
    chiudiProposta();
    mutate(getApiUrl() + "api/proposta/proposteAssegnate");
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
      name: "numero",
      label: "# Reclamo",
      options: {
        filter: true,
        filterType: "textField",
        filterOptions: {
          names: [],
          logic(val, value) {
            const numeroReclamo = Number(value[0]);
            return val !== numeroReclamo;
          },
        },
        sort: true,
        customBodyRenderLite: (dataIndex, rowIndex) => {
          const data = proposteList[dataIndex];
          return <span>{data.numero}</span>;
        },
      },
    },
    {
      name: "timestampCreazioneProposta",
      label: "Creata il",
      options: {
        filter: true,
        sort: true,
        display: true,
        customBodyRender: (value, tableMeta, update) => {
          return <span>{dayjs(value).format("DD/MM/YYYY")}</span>;
        },
        filterType: "custom",
        customFilterListOptions: {
          render: (v) => {
            if (v[0] && v[1]) {
              return [
                `Da: ${v[0].format("DD/MM/YYYY")}`,
                `A: ${v[1].format("DD/MM/YYYY")}`,
              ];
            } else if (v[0]) {
              return `Da: ${v[0].format("DD/MM/YYYY")}`;
            } else if (v[1]) {
              return `A: ${v[1].format("DD/MM/YYYY")}`;
            }
            return [];
          },
          update: (filterList, filterPos, index) => {
            if (filterPos === 0) {
              filterList[index].splice(filterPos, 1, "");
            } else if (filterPos === 1) {
              filterList[index].splice(filterPos, 1);
            } else if (filterPos === -1) {
              filterList[index] = [];
            }

            return filterList;
          },
        },
        filterOptions: {
          names: [],
          logic(data, filters) {
            const timestampCreazione = dayjs(data);
            if (filters[0] && filters[1]) {
              return !(
                !timestampCreazione.isSameOrBefore(filters[0]) &&
                !timestampCreazione.isSameOrAfter(filters[1])
              );
            } else if (filters[0]) {
              return !timestampCreazione.isSameOrAfter(filters[0]);
            } else if (filters[1]) {
              return !timestampCreazione.isSameOrBefore(filters[1]);
            }
            return false;
          },
          display: (filterList, onChange, index, column) => (
            <Stack spacing={1}>
              <FormLabel>Data creazione</FormLabel>
              <FormGroup row>
                <DateField
                  id="dataAperturaDa"
                  name="dataAperturaDa"
                  label="Da"
                  value={filterList[index][0] || ""}
                  onChange={(newValue) => {
                    filterList[index][0] = dayjs(newValue);
                    onChange(filterList[index], index, column);
                  }}
                  slotProps={{
                    textField: { size: "small" },
                  }}
                  style={{ width: "45%", marginRight: "5%" }}
                />
                <DateField
                  id="dataAperturaA"
                  name="dataAperturaA"
                  label="A"
                  value={filterList[index][1] || ""}
                  onChange={(newValue) => {
                    filterList[index][1] = dayjs(newValue);
                    onChange(filterList[index], index, column);
                  }}
                  slotProps={{
                    textField: { size: "small" },
                  }}
                  style={{ width: "45%", marginRight: "5%" }}
                />
              </FormGroup>
            </Stack>
          ),
        },
      },
    },
    {
      name: "codiceCausaList",
      label: "Cause",
      options: {
        filter: true,
        sort: true,
        display: true,
        filterType: "custom",
        customBodyRenderLite: (dataIndex, rowIndex) => {
          const data = proposteList[dataIndex];
          return (
            <Stack direction={"column"}>
              {getCodiciCausaUnivoci(data.codiceCausaList).map((causa) => {
                return <span>{causa}</span>;
              })}
            </Stack>
          );
        },
        customFilterListOptions: {
          render: (v) =>
            v
              .filter((x) => x !== undefined && x !== null)
              .map((l) => l.label.toUpperCase()),
          update: (filterList, filterPos, index) => {
            filterList[index].splice(filterPos, 1);
            actionSalvataggio.resetFiltro(index);
            return filterList;
          },
        },
        filterOptions: {
          logic: (val, filters) => {
            const causaSelezionata = filters[0];
            if (!causaSelezionata || causaSelezionata === null) return false;
            const idCausaSelezionata = causaSelezionata.label;
            return val.find((x) => x === idCausaSelezionata) === undefined;
          },
          display: (filterList, onChange, index, column) => {
            return (
              <Autocomplete
                key={"fornituraCausaReclamoList"}
                options={causaList}
                sx={{ width: "50vh", maxWidth: "100%" }}
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, value) =>
                  option.value === value.value
                }
                onChange={(e, value) => {
                  filterList[index] = [value];
                  onChange(filterList[index], index, column);
                }}
                size="small"
                fullWidth
                renderInput={(params) => (
                  <TextField
                    label={"Causa"}
                    fullWidth
                    size="small"
                    {...params}
                  />
                )}
              />
            );
          },
        },
      },
    },
    {
      name: "codicePartitaList",
      label: "ODL",
      options: {
        filter: true,
        filterType: "textField",
        filterOptions: {
          names: [],
          logic(codList, value) {
            const numList = getNumList(codList);
            const o = numList.find((x) => x === Number(value[0]));
            return o === undefined;
          },
        },
        sort: true,
        display: true,
        customBodyRenderLite: (dataIndex, rowIndex) => {
          const data = proposteList[dataIndex];
          return (
            <Stack direction={"column"}>
              {getPartiteUnivoche(data.codicePartitaList).map((x) => (
                <span>{x}</span>
              ))}
            </Stack>
          );
        },
      },
    },
    {
      name: "idCliente",
      label: "ID Cliente",
      options: {
        filter: true,
        sort: false,
        display: false,
        filterType: "custom",
        filterList: actionSalvataggio.ottieniFiltroDaStato(11),
        customFilterListOptions:
          autocompleteCustomFilterListOptions(actionSalvataggio),
        filterOptions: autocompleteFilterOption(
          "idCliente",
          "Cliente",
          optionsClienti
        ),
      },
    },
    {
      name: "codiceCliente",
      label: "Cliente",
      options: {
        filter: false,
        sort: true,
        display: true,
        customBodyRenderLite: (dataIndex, rowIndex) => {
          const data = proposteList[dataIndex];
          return (
            <Stack direction={"column"}>
              <span>{data.codiceCliente}</span>
              <span>
                <b>{data.descrizioneCliente}</b>
              </span>
            </Stack>
          );
        },
      },
    },
    {
      name: "codiceArticoloList",
      label: "Info reclamo",
      options: {
        filter: true,
        sort: true,
        display: true,
        customBodyRenderLite: (dataIndex, rowIndex) => {
          const data = proposteList[dataIndex];
          return (
            <RenderDatiArticoloValorizzazione
              codiceArticoloList={data.codiceArticoloList}
              codiceValuta={data.codiceValuta}
              valorizzazioneValuta={data.valorizzazioneValuta}
              valorizzazioneEuro={data.valorizzazioneEuro}
            />
          );
        },
      },
    },
    {
      name: "timestampChiusuraProposta",
      label: "Stato",
      options: {
        filter: false,
        sort: true,
        display: true,
        customBodyRenderLite: (dataIndex, rowIndex) => {
          const data = proposteList[dataIndex];
          const aperta = data.timestampChiusuraProposta === null ? true : false;
          return aperta ? "APERTA" : "CHIUSA";
        },
      },
    },
  ];

  const traduzione = getTraduzioneTabella();
  const tableOptions = {
    viewColumns: false,
    filter: true,
    filterType: "dropdown",
    downloadOptions: {
      filename: "proposte.csv",
      separator: ",",
      filterOptions: {
        useDisplayedColumnsOnly: true,
        useDisplayedRowsOnly: true,
      },
    },
    searchText: state.text,
    page: state.page ? state.page : 0,
    sortOrder: state.ordinamento,
    rowsPerPage: 100,
    rowsPerPageOptions: [100, 500, 1000, 1500, 5000, 10000, 20000],
    selectableRows: "none",
    elevation: 4,
    searchOpen: false,
    textLabels: traduzione,
    responsive: "scrollMaxHeight",
    customSearchRender: GenericSearchRender(300),
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
        apriPropostaTable(proposteList[dataIndex].id);
      },
    }),
    responsive: "standard",
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
        filtroSelezionato={idFiltroSelezionatoInterno}
        filterList={filtriList}
        isLoading={isLoading}
        onFilterSelected={onFilterSelected}
        onSync={onSyncMenu}
      />
      <Box width={"100%"}>
        {isLoading !== undefined && !isLoading && isReady ? (
          <MUIDataTable
            title={"Proposte assegnate a me"}
            columns={columns}
            options={tableOptions}
            data={proposteList}
          />
        ) : (
          <Container>
            <Stack
              direction={"row"}
              spacing={2}
              justifyContent="flex-start"
              alignItems="center"
            >
              <CircularProgress />
              <Typography variant="h6">Caricamento...</Typography>
            </Stack>
          </Container>
        )}
        <DialogModificaProposta
          idProposta={idPropostaAperta}
          opened={idPropostaAperta !== undefined}
          handleClose={chiudiProposta}
          handleOnSubmit={handleSubmitModifica}
          soloVisualizzazione={idFiltroSelezionatoInterno !== 1}
          includiDatiReclamo
        />
      </Box>
    </Stack>
  );
}

Page.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
