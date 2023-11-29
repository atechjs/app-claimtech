import {
  Avatar,
  Box,
  Chip,
  CircularProgress,
  Container,
  Stack,
  Autocomplete,
  TextField,
  ThemeProvider,
  Typography,
  createTheme,
  FormLabel,
  FormGroup,
} from "@mui/material";
import Layout from "../components/layout";
import NestedLayout from "../components/nestedLayout";

import MenuFiltri from "../components/reclamiAssegnati/menuFiltri";
import { useEffect, useState } from "react";
import AggiungiFiltroDialog from "../components/reclamiAssegnati/aggiungiFiltroDialog";
import { usePathname, useSearchParams } from "next/navigation";
import MUIDataTable from "mui-datatables";
import { getTraduzioneTabella } from "../components/my-mui-data-table/traduzioneTabella";
import GenericSearchRender from "../components/my-mui-data-table/genericSearchRender";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import GetCurrentAxiosInstance from "../utils/Axios";
import getApiUrl from "../utils/BeUrl";
import { mandaNotifica } from "../utils/ToastUtils";
import { getAxiosFetcher } from "../utils/AxiosFetcher";
import useSWR from "swr";
import useReclamiAssegnati from "../components/fetching/useReclamiAssegnati";
import CircleIcon from "@mui/icons-material/Circle";
import TagIcon from "@mui/icons-material/Tag";
import Tag from "../components/tag";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PersonIcon from "@mui/icons-material/Person";
import ValueWithIcon from "../components/my-mui-data-table/valueWithIcon";
import FactoryIcon from "@mui/icons-material/Factory";
import ChipUtentiAssegnati from "../components/my-mui-data-table/chipUtentiAssegnati";
import TagSet from "../components/my-mui-data-table/tagSet";
import { Warning } from "@mui/icons-material";
import MyReactSelect from "../components/my-react-select-impl/myReactSelect";
import Select from "react-select";
import autocompleteCustomFilterListOptions from "../components/my-mui-data-table/autocompleteCustomFilterListOptions";
import autocompleteFilterOption from "../components/my-mui-data-table/autocompleteFilterOption";
import useClienteSelect from "../components/fetching/useClienteSelect";
import { useTableStateSaverV2 } from "../components/my-mui-data-table/useTableStateSaverV2";
import ReclamiCustomToolbar from "../components/reclamiAssegnati/reclamiCustomToolbar";
import DialogCondivisioneUtenti from "../components/condivisioneUtente/DialogCondivisioneUtenti";
import ToolbarPulsanteAggiungi from "../components/my-mui-data-table/ToolbarPulsanteAggiungi";
import StatoReclamo from "../components/statoReclamo";
import EuroIcon from "@mui/icons-material/Euro";
import ModificaDatiFornitura from "../components/reclamo/datiFornitura/modificaDatiFornitura";
import { formattaOdl, getNumList, getPartiteUnivoche } from "../utils/OdlUtils";
import {
  formattaArticolo,
  getCodiciArticoloUnivoci,
} from "../utils/articoloUtils";
import { getCodiciCausaUnivoci } from "../utils/causaUtils";
import useCausaSelect from "../components/fetching/useCausaSelect";
import useStatoFornituraSelect from "../components/fetching/useStatoFornituraSelect";
import { DateField } from "@mui/x-date-pickers/DateField";
import { getStatiFornituraList } from "../utils/partitaUtils";

export default function Page() {
  var isSameOrBefore = require("dayjs/plugin/isSameOrBefore");
  dayjs.extend(isSameOrBefore);
  var isSameOrAfter = require("dayjs/plugin/isSameOrAfter");
  dayjs.extend(isSameOrAfter);
  //const [filtroSelezionato, setFiltroSelezionato] = useState(undefined);
  const [idFiltroSelezionatoInterno, setIdFiltroSelezionatoInterno] =
    useState(-1);
  const [valueFiltro, setValueFiltro] = useState(undefined);
  const [dialogAggiungiFiltroAperto, setDialogAggiungiFiltroAperto] =
    useState(false);
  const [openedDialogCondivisione, setOpenedDialogCondivisione] =
    useState(false);

  const [fetch, setFetch] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { query, isReady } = router;
  const [state, actionSalvataggio] = useTableStateSaverV2();
  const instance = GetCurrentAxiosInstance();
  const [righeSelezionate, setRigheSelezionate] = useState([]);
  const { clientiList: optionsClienti } = useClienteSelect();
  const { causaList } = useCausaSelect();
  const { statoFornituraList } = useStatoFornituraSelect();
  //idReclamoModificato è utilizzato per il dialog di condivisione a seguito salvataggio
  const [idReclamoModificato, setIdReclamoModificato] = useState(undefined);
  useEffect(() => {
    if (!isReady) return;
    setFetch(true);
    actionSalvataggio.createIntialState(router, searchParams, pathname);
  }, [isReady]);

  const onDataSuccess = (data) => {
    setIdFiltroSelezionatoInterno(data.idFiltroSelezionato);
  };

  const {
    idFiltroSelezionato,
    filtriList,
    reclamiList,
    mutate,
    isLoading,
    error,
  } = useReclamiAssegnati(fetch, query, onDataSuccess);

  function setParam(key, value) {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set(key, value);
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`${pathname}${query}`);
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

  const aggiornaIdFiltroSelezionato = (id) => {
    //Valutare se la chiamata per riottenere la pagina conviene farla qua o quando cambio idFiltroSelezionato
    setParam("idFiltroSelezionato", id);
    setIdFiltroSelezionatoInterno(id);
  };

  const onFilterSelected = (filtro) => {
    //Salvo l'id nell'url
    aggiornaIdFiltroSelezionato(filtro.id);
    setRigheSelezionate([]);
    //TODO Implementare logica BE(ricaricare la lista(tipo come con sync?))
    //TODO probabilmente devo renderizzare la pagina solo quando ho la lista dei filtri
    //e devo anche vedere come settare il filtro selezionato all'inizio
    //TODO FETCH RECLAMI BE
  };

  const onSyncClicked = () => {
    setRigheSelezionate([]);
    mutate(getApiUrl() + "api/reclamo/reclamiAssegnati");
  };

  const onFilterAdd = () => {
    setValueFiltro(undefined);
    setDialogAggiungiFiltroAperto(true);
  };

  const onFilterUpdate = (idFiltro) => {
    setValueFiltro(filtriList.find((x) => x.id === idFiltro));
    setDialogAggiungiFiltroAperto(true);
  };

  const onFilterDelete = (idFiltro) => {
    instance
      .post(getApiUrl() + "api/categoriaFiltro/delete?id=" + idFiltro)
      .then((response) => {
        //setFiltriList(filtriList.filter((x) => x.id !== idFiltro));
        aggiornaIdFiltroSelezionato(-1);
      })
      .catch((error) => {
        mandaNotifica("Impossibile cancellare il filtro", "error");
      });
  };

  const onDialogAggiungiFiltroSubmit = (values, resetForm) => {
    if (values.pinned === undefined || values.pinned === null)
      values.pinned = false;
    instance
      .post(getApiUrl() + "api/categoriaFiltro/crea", values)
      .then((response) => {
        const id = response.data;
        values = { ...values, id: id };
        //TODO Chiamata a BE per reclami. il conteggio di quelli può darmelo la chiamata di inserimento
        aggiornaIdFiltroSelezionato(id);
        //Chiudo il dialog
        setDialogAggiungiFiltroAperto(false);
        //Resetto il form
        resetForm();
      })
      .catch((error) => {
        console.error(error);
        mandaNotifica("Impossibile aggiungere il filtro", "error");
      });
  };

  const onDialogUpdateFiltroSubmit = (values, resetForm) => {
    setDialogAggiungiFiltroAperto(false);
    instance
      .post(getApiUrl() + "api/categoriaFiltro/update", values)
      .then((response) => {
        aggiornaIdFiltroSelezionato(values.id);

        setValueFiltro(values);
        //Resetto il form
        resetForm();
        onSyncClicked();
      })
      .catch((error) => {
        mandaNotifica("Impossibile modificare il filtro", "error");
      });
  };

  function vhToPixels(vh) {
    return Math.round(window.innerHeight / (100 / vh));
  }

  const getMuiTheme = () =>
    createTheme({
      components: {
        MUIDataTableBodyCell: {
          styleOverrides: {
            root: {
              padding: "4px 1px 4px 1px",
            },
          },
        },
        MuiChip: {
          variants: [
            {
              props: { variant: "square" },
              style: {
                borderRadius: 8,
                justifyContent: "center",
                flexWrap: "wrap",
              },
            },
          ],
        },
      },
    });
  /*
  const theme = createMui({
    overrides: {
      MuiTableCell: {
        root: {
          padding: "40px 24px 40px 16px",
          backgroundColor: "lightblue",
        },
      },
    },
  });*/

  const displayChipUtente = (utente) => {
    return (
      <Stack
        direction={"row"}
        spacing={2}
        justifyContent="center"
        alignItems="flex-start"
      >
        <Chip
          size="small"
          avatar={
            <Avatar>
              {utente.username.length >= 2
                ? utente.username.charAt(0) + utente.username.charAt(1)
                : utente.username}
            </Avatar>
          }
          label={utente.nome + " " + utente.cognome}
        />
      </Stack>
    );
  };

  const displayUtentiAssegnati = (utentiList) => {
    utentiList = utentiList.sort((a, b) => a.username > b.username);
    if (utentiList.length > 1) {
      const altriUtenti = utentiList.slice(1);
      return (
        <>
          {displayChipUtente(utentiList[0])}
          <ChipUtentiAssegnati utentiList={altriUtenti} />
        </>
      );
    } else {
      return utentiList.map((utente) => {
        return (
          <Stack
            direction={"row"}
            spacing={2}
            justifyContent="center"
            alignItems="flex-start"
          >
            <Chip
              size="small"
              avatar={
                <Avatar>
                  {utente.username.length >= 2
                    ? utente.username.charAt(0) + utente.username.charAt(1)
                    : utente.username}
                </Avatar>
              }
              label={utente.nome + " " + utente.cognome}
            />
          </Stack>
        );
      });
    }
  };

  const displayTagList = (tagList) => {
    const MAX = 2;
    if (tagList.length > MAX) {
      const primi = tagList.slice(0, MAX);
      const rimanenti = tagList.slice(MAX);
      return (
        <>
          {primi.map((tag) => (
            <Tag label={tag.descrizione} colore={tag.colore} />
          ))}
          <TagSet tagList={rimanenti} />
        </>
      );
    } else {
      return tagList.map((tag) => (
        <Tag label={tag.descrizione} colore={tag.colore} />
      ));
    }
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
      label: "Reclamo",
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
        customBodyRender: (value, tableMeta, update) => {
          const rowData = tableMeta.rowData;
          const codiceReclamoCliente = rowData[4];
          const tagList = rowData[8];
          const aperto = rowData[9];
          const codiceTipologiaReclamo = rowData[10];
          return (
            <Stack direction={"column"}>
              <Stack
                direction={"row"}
                spacing={1}
                justifyContent="flex-start"
                alignItems="center"
              >
                <StatoReclamo
                  aperto={aperto}
                  codiceTipologiaReclamo={codiceTipologiaReclamo}
                />
                <Stack
                  direction={"row"}
                  spacing={1}
                  justifyContent="flex-start"
                  alignItems="center"
                >
                  <Typography
                    variant="body1"
                    align="left"
                    alignContent={"flex-start"}
                  >
                    <b>{value}</b>
                  </Typography>
                </Stack>
              </Stack>
              <Stack
                direction={"row"}
                spacing={1}
                justifyContent="flex-start"
                alignItems="center"
              >
                <TagIcon fontSize="small" />
                <Typography
                  variant="body1"
                  align="left"
                  alignContent={"flex-start"}
                >
                  {codiceReclamoCliente}
                </Typography>
              </Stack>
              <Stack direction={"row"} spacing={0.5}>
                {displayTagList(tagList)}
              </Stack>
            </Stack>
          );
        },
      },
    },
    {
      name: "idFase",
      label: "ID Fase",
      options: {
        filter: false,
        sort: false,
        display: false,
      },
    },
    {
      name: "codiceFase",
      label: "Fase",
      options: {
        filter: false,
        sort: true,
        display: true,
      },
    },
    {
      name: "codiceReclamoCliente",
      label: "Codice reclamo cliente",
      options: {
        filter: true,
        sort: true,
        display: false,
        filterType: "textField",
      },
    },
    {
      name: "timestampCreazione",
      label: "Data apertura",
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
              <FormLabel>Data apertura</FormLabel>
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
      name: "partitaList",
      label: "Cause",
      options: {
        filter: true,
        sort: true,
        display: true,
        filterType: "custom",
        customBodyRenderLite: (dataIndex, rowIndex) => {
          return (
            <Stack direction={"column"}>
              {getCodiciCausaUnivoci(
                reclamiList[dataIndex].partitaList.flatMap((x) =>
                  x.causaReclamoList.map((y) => y.codiceCausa)
                )
              ).map((causa) => {
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
            console.log("causaSelezionata", causaSelezionata);
            const idCausaSelezionata = causaSelezionata.value;
            const causaList = val.flatMap((x) =>
              x.causaReclamoList.map((y) => y.idCausa)
            );
            return (
              causaList.find((x) => x === idCausaSelezionata) === undefined
            );
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
      name: "partitaList",
      label: "ODL",
      options: {
        filter: true,
        filterType: "textField",
        filterOptions: {
          names: [],
          logic(codList, value) {
            const numList = getNumList(codList.flatMap((x) => x.codice));
            const o = numList.find((x) => x === Number(value[0]));
            return o === undefined;
          },
        },
        sort: true,
        display: true,
        customBodyRenderLite: (dataIndex, rowIndex) => {
          return (
            <Stack direction={"column"}>
              {getPartiteUnivoche(
                reclamiList[dataIndex].partitaList.map((x) => x.codice)
              ).map((x) => (
                <span>{x}</span>
              ))}
            </Stack>
          );
        },
      },
    },
    {
      name: "tagList",
      label: "TagList",
      options: {
        filter: false,
        sort: true,
        display: false,
      },
    },
    {
      name: "aperto",
      label: "Aperto",
      options: {
        filter: false,
        sort: true,
        display: false,
      },
    },
    {
      name: "codiceTipologiaReclamo",
      label: "Tipologia reclamo",
      options: {
        filter: false,
        sort: true,
        display: false,
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
        customBodyRender: (value, tableMeta, update) => {
          const rowData = tableMeta.rowData;
          const descrizioneCliente = rowData[13];
          return (
            <Stack direction={"column"}>
              <span>{value}</span>
              <span>
                <b>{descrizioneCliente}</b>
              </span>
            </Stack>
          );
        },
      },
    },
    {
      name: "descrizioneCliente",
      label: "Descrizione cliente",
      options: {
        filter: false,
        sort: true,
        display: false,
      },
    },
    {
      name: "codiceStabilimento",
      label: "Stabilimento",
      options: {
        filter: true,
        sort: true,
        display: false,
        customBodyRender: (value, tableMeta, update) => {
          return (
            <ValueWithIcon
              value={value}
              icon={<FactoryIcon fontSize="small" />}
            />
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
        customBodyRender: (value, tableMeta, update) => {
          const rowData = tableMeta.rowData;
          const valorizzazioneValuta = rowData[16];
          return (
            <Stack direction={"column"}>
              {getCodiciArticoloUnivoci(value).map((x) => (
                <span>{x}</span>
              ))}
              <span>
                <Chip
                  label={valorizzazioneValuta}
                  variant="outlined"
                  color="success"
                  size="small"
                  icon={<EuroIcon />}
                />
              </span>
            </Stack>
          );
        },
      },
    },
    {
      name: "valorizzazioneValuta",
      label: "Valorizzazione",
      options: {
        filter: false,
        sort: true,
        display: false,
      },
    },
    {
      name: "utentiList",
      label: "Assegnato a",
      options: {
        filter: false,
        sort: true,
        display: false,
        customBodyRender: (value, tableMeta, update) => {
          return (
            <Stack
              direction={"column"}
              justifyContent="flex-start"
              alignItems="flex-start"
              spacing={0.5}
            >
              {displayUtentiAssegnati(value)}
            </Stack>
          );
        },
      },
    },
    {
      name: "idForm",
      label: "idForm",
      options: {
        filter: false,
        sort: false,
        display: false,
      },
    },
    {
      name: "codiceValuta",
      label: "codiceValuta",
      options: {
        filter: false,
        sort: false,
        display: false,
      },
    },
    {
      name: "costoCartaAdesivo",
      label: "costoCartaAdesivo",
      options: {
        filter: false,
        sort: false,
        display: false,
      },
    },
    {
      name: "costoRibobinatrice",
      label: "costoRibobinatrice",
      options: {
        filter: false,
        sort: false,
        display: false,
      },
    },
    {
      name: "costoFermoMacchina",
      label: "costoFermoMacchina",
      options: {
        filter: false,
        sort: false,
        display: false,
      },
    },
    {
      name: "partitaList",
      label: "partitaList",
      options: {
        filter: true,
        sort: false,
        display: false,
        filterType: "custom",
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
            const statoFornituraSelezionato = filters[0];
            if (
              !statoFornituraSelezionato ||
              statoFornituraSelezionato === null
            )
              return false;
            const idStatoFornituraSelezionato = statoFornituraSelezionato.value;
            const statoFornituraList = val.flatMap((x) =>
              x.causaReclamoList.map((y) => y.idStato)
            );
            return (
              statoFornituraList.find(
                (x) => x === idStatoFornituraSelezionato
              ) === undefined
            );
          },
          display: (filterList, onChange, index, column) => {
            return (
              <Autocomplete
                key={"partitaList"}
                options={statoFornituraList}
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
                    label={"Stato fornitura"}
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
      name: "columnData",
      label: "columnData",
      options: {
        filter: false,
        sort: false,
        display: false,
      },
    },
    {
      name: "exprValuta",
      label: "exprValuta",
      options: {
        filter: false,
        sort: false,
        display: false,
      },
    },
    {
      name: "numero",
      label: "Reclamo",
      options: {
        filter: false,
        sort: true,
        display: false,
      },
    },
    {
      name: "modifica",
      label: "modifica",
      options: {
        filter: false,
        sort: false,
        display: false,
      },
    },
    {
      name: "partitaList",
      label: "Stati",
      options: {
        filter: true,
        sort: true,
        display: true,
        filterType: "custom",
        customBodyRenderLite: (dataIndex, rowIndex) => {
          const map = getStatiFornituraList(
            reclamiList[dataIndex].partitaList.flatMap((x) =>
              x.causaReclamoList.map((y) => y.codiceStato)
            )
          );
          return (
            <Stack direction={"column"} spacing={1}>
              {Object.keys(map).map((codiceStato) => {
                return (
                  <Chip
                    label={codiceStato + "(" + map[codiceStato].length + ")"}
                    color="primary"
                    size="small"
                  />
                );
              })}
            </Stack>
          );
        },
      },
    },
  ];

  function clickButtonNuovo() {
    mantieni();
    router.push("/reclamo/nuovo");
  }

  const handleClickOpenDialogCondivisione = () => {
    setOpenedDialogCondivisione(true);
  };

  const handleCloseDialogCondivisione = () => {
    setOpenedDialogCondivisione(false);
  };

  const handleOnCondividiSubmit = (list) => {
    if (idReclamoModificato === undefined) return;
    const idUtenteList = list.map((utente) => utente.id);
    instance
      .post(getApiUrl() + "api/reclamo/condividi", {
        idReclamoList: [idReclamoModificato],
        idUtenteList: idUtenteList,
      })
      .then(() => {
        mandaNotifica("Reclamo condiviso correttamente", "success");
        handleCloseDialogCondivisione();
      })
      .catch(() => mandaNotifica("Impossibile condividere il reclamo", "error"))
      .then(() => setIdReclamoModificato(undefined));
  };

  const onModificaFornituraSubmit = (responseData, data) => {
    if (responseData.richiedeCondivisione) {
      setIdReclamoModificato(data.id);
      handleClickOpenDialogCondivisione();
    }
    //TODO Posso aggiornare il mio data?
  };

  const traduzione = getTraduzioneTabella();
  const tableOptions = {
    viewColumns: false,
    filter: true,
    filterType: "dropdown",
    downloadOptions: {
      filename: "reclami.csv",
      separator: ",",
      filterOptions: {
        useDisplayedColumnsOnly: true,
        useDisplayedRowsOnly: true,
      },
    },
    searchText: state.text,
    page: state.page ? state.page : 0,
    sortOrder: state.ordinamento,
    rowsPerPage: 50,
    rowsPerPageOptions: [50, 100, 500, 1000, 1500, 5000, 10000, 20000],
    elevation: 4,
    searchOpen: false,
    textLabels: traduzione,
    rowsSelected: righeSelezionate,
    responsive: "scrollMaxHeight",
    onRowSelectionChange: (rowsSelectedData, allRows, rowsSelected) => {
      setRigheSelezionate(rowsSelected);
    },
    customToolbar: () => {
      return <ToolbarPulsanteAggiungi onAddClick={clickButtonNuovo} />;
    },
    customToolbarSelect: (selectedRows, displayData, setSelectedRows) => (
      <ReclamiCustomToolbar
        selectedRows={selectedRows}
        displayData={displayData}
        setSelectedRows={setSelectedRows}
        onUpdateReclami={onSyncClicked}
      />
    ),
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
        apriReclamo(row[0]);
      },
    }),
    expandableRows: true,
    responsive: "standard",
    renderExpandableRow: (rowData, rowMeta) => {
      const idReclamo = rowData[0];
      const idForm = rowData[18];
      const codiceValuta = rowData[19];
      const costoCartaAdesivo = rowData[20];
      const costoRibobinatrice = rowData[21];
      const costoFermoMacchina = rowData[22];
      const partitaList = rowData[23];
      const columnData = rowData[24];
      const exprValuta = rowData[25];
      const modificaLista = false;
      return (
        <>
          <tr>
            <td colSpan={20}>
              <Box>
                <ModificaDatiFornitura
                  idReclamo={idReclamo}
                  idForm={idForm}
                  codiceValuta={codiceValuta}
                  costoCartaAdesivo={costoCartaAdesivo}
                  costoRibobinatrice={costoRibobinatrice}
                  costoFermoMacchina={costoFermoMacchina}
                  partitaList={partitaList}
                  columnsData={columnData}
                  exprValuta={exprValuta}
                  onSubmit={onModificaFornituraSubmit}
                  modificaLista={modificaLista}
                  widthOffset={450}
                />
              </Box>
            </td>
          </tr>
        </>
      );
    },
  };

  function apriReclamo(value) {
    mantieni();
    router.push("/reclamo/" + value + "/generale");
  }

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
        onSync={onSyncClicked}
        onFilterSelected={onFilterSelected}
        onFilterAdd={onFilterAdd}
        onFilterUpdate={onFilterUpdate}
        onFilterDelete={onFilterDelete}
        isLoading={isLoading}
      />
      <Box width={"100%"}>
        {isLoading !== undefined && !isLoading && isReady ? (
          <ThemeProvider theme={getMuiTheme}>
            <MUIDataTable
              title={"Reclami assegnati a me"}
              columns={columns}
              options={tableOptions}
              data={reclamiList}
            />
          </ThemeProvider>
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
      </Box>
      <AggiungiFiltroDialog
        aperto={dialogAggiungiFiltroAperto}
        ooo={() => setDialogAggiungiFiltroAperto(false)}
        onSubmitCreaCallback={onDialogAggiungiFiltroSubmit}
        onSubmitUpdateCallback={onDialogUpdateFiltroSubmit}
        defaultValues={valueFiltro}
      />
      <DialogCondivisioneUtenti
        opened={openedDialogCondivisione}
        handleClickOpen={handleClickOpenDialogCondivisione}
        handleClose={handleCloseDialogCondivisione}
        handleOnSubmit={handleOnCondividiSubmit}
      />
    </Stack>
  );
}

Page.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
