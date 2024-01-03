import {
  Box,
  Button,
  Divider,
  Paper,
  Stack,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { create, all, isNumber, exp, index } from "mathjs";
import MyTableCell from "./myTableCell";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import createTheme from "@mui/material";
import axios from "axios";
import { mandaNotifica } from "../../../utils/ToastUtils";
import getConverterApiKey from "../../../utils/converterApi";
import dayjs from "dayjs";
import DialogAggiungiPartita from "./dialogAggiungiPartita";
import DialogCopiaPartita from "./dialogCopiaPartita";
import DialogEliminaPartita from "./dialogEliminaPartita";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import RemoveIcon from "@mui/icons-material/Remove";
import useCausaSelect from "../../fetching/useCausaSelect";
import useStatoFornituraSelect from "../../fetching/useStatoFornituraSelect";
import GetCurrentAxiosInstance from "../../../utils/Axios";
import getApiUrl from "../../../utils/BeUrl";
import DialogInfo from "./dialogInfo";
export default function ModificaDatiFornitura({
  idReclamo,
  idForm,
  codiceValuta,
  costoCartaAdesivo,
  costoRibobinatrice,
  costoFermoMacchina,
  partitaList,
  columnsData,
  exprValuta,
  onSubmit,
  modificaLista,
  widthOffset,
  abilitaModifica = false,
}) {
  const instance = GetCurrentAxiosInstance();
  const { causaList } = useCausaSelect();
  const { statoFornituraList } = useStatoFornituraSelect();
  const [infoSelezionato, setInfoSelezionato] = useState(undefined);
  const columnHelper = createColumnHelper();

  const getColumnsData = (data) => {
    const colonneFisse = [
      {
        id: "codice",
        codice: "codice",
        nome: "Partita",
        codiceTipo: "CODICEPARTITA",
        associazioneList: [],
        options: [],
      },
      {
        id: "codicePartitaCliente",
        codice: "codicePartitaCliente",
        nome: "Codice partita cliente",
        codiceTipo: "TEXTSTRING",
        associazioneList: [],
        options: [],
      },
      {
        id: "partitaCausaReclamo_idStato",
        codice: "partitaCausaReclamo_idStato",
        nome: "Stato",
        codiceTipo: "STATO_FORNITURA_CAUSA_RECLAMO",
        associazioneList: [],
        options: statoFornituraList,
      },
      {
        id: "partitaCausaReclamo_idCausa",
        codice: "partitaCausaReclamo_idCausa",
        nome: "Cause",
        codiceTipo: "SELECT",
        associazioneList: [],
        options: causaList,
      },
    ];
    let colonne = [];
    data.forEach((colonna) => {
      colonne = [...colonne, colonna];
      if (colonna.includiNelReso) {
        colonne = [
          ...colonne,
          {
            id: colonna.id,
            codice: colonna.codice + "_includiNelReso",
            nome: colonna.nome + " da rendere",
            codiceTipo: "CHECK",
            associazioneList: [],
            options: [],
          },
        ];
      }
    });
    const colonneDopoCampi = [
      {
        id: "partitaCausaReclamo_valoreContestazione",
        codice: "partitaCausaReclamo_valoreContestazione",
        nome: "VALORE CONTESTAZIONE",
        codiceTipo: "TEXT",
        associazioneList: [],
        options: [],
      },
      {
        id: "partitaCausaReclamo_valoreContestazioneCliente",
        codice: "partitaCausaReclamo_valoreContestazioneCliente",
        nome: "VALORE CONTESTAZIONE CLIENTE",
        codiceTipo: "TEXT",
        associazioneList: [],
        options: [],
      },
    ];
    return colonneFisse.concat(colonne).concat(colonneDopoCampi);
  };

  const mapToColumnsArray = (columnsData) => {
    return getColumnsData(columnsData).map((data) => {
      return columnHelper.accessor(data.codice, {
        header: data.nome,
        cell: MyTableCell,
        meta: {
          type: data.codiceTipo,
          dependencies: data.associazioneList,
          options: data.options,
        },
      });
    });
  };

  const columns = mapToColumnsArray(columnsData);
  const fromDefToTransformed = (dataList) => {
    let arr = [];

    dataList.forEach((partita) => {
      partita.causaReclamoList.forEach((partitaCausaReclamo) => {
        let newObj = { ...partita };
        Object.keys(partitaCausaReclamo).forEach((key) => {
          if (key !== "campi") {
            newObj = {
              ...newObj,
              ["partitaCausaReclamo_" + key]: partitaCausaReclamo[key],
            };
          } else {
            partitaCausaReclamo["campi"].forEach(
              (campo) =>
                (newObj = {
                  ...newObj,
                  [campo.codice]: campo.value,
                  [campo.codice + "_includiNelReso"]: campo.rendi,
                })
            );
          }
        });
        arr = [...arr, newObj];
      });
    });
    return arr;
  };

  const config = {};
  const math = create(all, config);
  const [data, setData] = useState(() => fromDefToTransformed(partitaList));
  const [valorizzazioneTotaleValuta, setValorizzazioneTotaleValuta] =
    useState(0);
  const [
    valorizzazioneTotaleClienteValuta,
    setValorizzazioneTotaleClienteValuta,
  ] = useState(0);

  const [dialogAggiungiOpen, setDialogAggiungiOpen] = useState(false);
  const [dialogCopiaOpen, setDialogCopiaOpen] = useState(false);
  const [dialogEliminaOpen, setDialogEliminaOpen] = useState(false);
  const [dialogInfoOpen, setDialogInfoOpen] = useState(false);

  useEffect(() => {
    //Valorizzazione totale iniziale
    valorizzazioneTotale(fromDefToTransformed(partitaList));
  }, []);

  function isNumeric(str) {
    return (
      !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
      !isNaN(parseFloat(str))
    ); // ...and ensure strings of whitespace fail
  }

  const approssima = (num) => {
    if (Array.isArray(num)) return num;
    if (!isNumeric(num)) return num;
    const approssimato = roundToTwo(num);
    return approssimato;
  };

  function roundToTwo(num) {
    return +(Math.round(num + "e+2") + "e-2");
  }

  const calcolaValorizzazioneTotale = (tempData, campo) => {
    let valorizzazioneTotale = 0;
    tempData.forEach(
      (partita) =>
        (valorizzazioneTotale = approssima(
          valorizzazioneTotale + Number(partita[campo])
        ))
    );
    return valorizzazioneTotale;
  };

  //Calcola la valorizzazione totale del reclamo
  const valorizzazioneTotale = (tempData) => {
    let valorizzazioneTotaleValutaSum = calcolaValorizzazioneTotale(
      tempData,
      "partitaCausaReclamo_valoreContestazione"
    );
    setValorizzazioneTotaleValuta(valorizzazioneTotaleValutaSum);

    let valorizzazioneTotaleClienteValuta = calcolaValorizzazioneTotale(
      tempData,
      "partitaCausaReclamo_valoreContestazioneCliente"
    );
    setValorizzazioneTotaleClienteValuta(valorizzazioneTotaleClienteValuta);
  };

  const modificaTempDataCodicePartitaCliente = (value, tempData, codice) => {
    let temp = [];
    tempData.forEach((td) => {
      if (td.codice === codice) {
        td = { ...td, codicePartitaCliente: value };
      }
      temp = [...temp, td];
    });
    return temp;
  };

  const modificaTempData = (value, tempData, rowIndex, columnId) => {
    tempData[rowIndex][columnId] = approssima(value);
    return tempData;
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      updateData: (row, column, value, meta) => {
        const rowIndex = row.index;
        const columnId = column.id;
        const dependencies = meta.dependencies;
        const rowData = row.original;
        let tempData = data;
        const tipo = meta.type;
        switch (tipo) {
          case "TEXT":
          case "TEXTSTRING":
          case "MULTISELECT":
          case "CHECK":
            if (columnId === "codicePartitaCliente")
              tempData = modificaTempDataCodicePartitaCliente(
                value,
                tempData,
                rowData.codice
              );
            else
              tempData = modificaTempData(value, tempData, rowIndex, columnId);
            break;
          case "SELECT":
          case "STATO_FORNITURA_CAUSA_RECLAMO":
            if (columnId === "partitaCausaReclamo_idStato")
              tempData[rowIndex]["azzeraPartita"] = value.azzeraPartita;
            tempData = modificaTempData(
              !value || value == null ? null : value.value,
              tempData,
              rowIndex,
              columnId
            );
            break;
        }

        setData(tempData);
        dependencies.forEach((dependency) => {
          if (!value || value === null || value === "") return;
          const kgFatt = rowData.qtaKgFattura;
          const qtaFatt = rowData.qtaFattura;
          const valoreFatt = rowData.valoreFattura;
          const rapportoValore = valoreFatt / qtaFatt;

          //1 - Sostituisco a EXPR i valori che servono
          const code = dependency.codiceDipendente;
          let expr = dependency.expr;
          expr = expr.replaceAll("[value]", value);
          expr = expr.replaceAll("[coefFattura]", rapportoValore);
          expr = expr.replaceAll("[kgFattura]", kgFatt);
          expr = expr.replaceAll("[qtaFattura]", qtaFatt); //prima sqmFattura
          expr = expr.replaceAll("[cCartaAdesivo]", costoCartaAdesivo);
          expr = expr.replaceAll("[cRibob]", costoRibobinatrice);
          expr = expr.replaceAll("[cFermoMacchina]", costoFermoMacchina);
          expr = expr.replaceAll("[spessoreArticolo]", rowData.spessore);
          expr = expr.replaceAll("[altezzaArticolo]", rowData.altezza);
          expr = expr.replaceAll("[lunghezzaArticolo]", rowData.lunghezza);
          //2 - Parso e calcolo il risultato
          const result = approssima(math.evaluate(expr));
          //3 - Salvo il risultato a code
          tempData[rowIndex][code] = result;
          setData((old) =>
            old.map((row, index) => {
              if (index === rowIndex) {
                tempData[rowIndex][code] = result;
                return {
                  ...old[rowIndex],
                  [code]: result,
                };
              }
              return row;
            })
          );
        });
        let valorizzazioneValuta = 0;
        //Calcolare valoreContestazione solo se non sto cambiando il campo
        //Ottengo tutti i campi in expr tra parentesi quadre, per ottenere il valore basta andare in
        switch (columnId) {
          case "partitaCausaReclamo_valoreContestazione":
            valorizzazioneValuta = approssima(value);
            break;
          case "partitaCausaReclamo_valoreContestazioneCliente":
            valorizzazioneValuta =
              tempData[rowIndex]["partitaCausaReclamo_valoreContestazione"];
            break;
          default:
            let arr = [];
            Object.keys(tempData[rowIndex]).map((k) => {
              arr = [...arr, { key: k, value: tempData[rowIndex][k] }];
            });
            let exprValorizzazione = exprValuta;
            arr.forEach((obj) => {
              exprValorizzazione = exprValorizzazione.replaceAll(
                "[" + obj.key + "]",
                obj.value
              );
            });
            valorizzazioneValuta = approssima(
              math.evaluate(exprValorizzazione)
            );
            break;
        }
        tempData[rowIndex]["partitaCausaReclamo_valoreContestazione"] =
          valorizzazioneValuta;
        setData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex],
                ["partitaCausaReclamo_valoreContestazione"]:
                  valorizzazioneValuta,
              };
            }
            return row;
          })
        );

        valorizzazioneTotale(tempData);
      },
      onInfoButtonClick: (values) => {
        setInfoSelezionato(values);
        setDialogInfoOpen(true);
      },
    },
  });

  const getStyleSticky = (index) => {
    if (index == 0)
      return {
        position: "sticky",
        left: 0,
        background: "white",
        boxShadow: "5px 2px 5px grey",
        zIndex: "200",
      };
    return {};
  };

  const getDatiFornitura = (fornituraCausaReclamo) => {
    let fornituraData = {};
    Object.keys(fornituraCausaReclamo).forEach((campo) => {
      const value = fornituraCausaReclamo[campo];
      if (
        campo.startsWith("partitaCausaReclamo_") ||
        (columnsData.find((x) => x.codice === campo) && isNumber(value))
      )
        return;
      if (campo === "dataFattura" || campo === "dataProduzione")
        fornituraData = {
          ...fornituraData,
          [campo]: dayjs(value).format("YYYY-MM-DD[T]hh:mm:ss"),
        };
      else fornituraData = { ...fornituraData, [campo]: value };
    });
    return fornituraData;
  };

  const mappaPartitaGroupsToObjectBackend = (partitaGroups) => {
    let fornituraList = [];
    Object.keys(partitaGroups).map((codicePartita) => {
      const fornituraCausaReclamoList = partitaGroups[codicePartita];
      let fornituraData = getDatiFornitura(fornituraCausaReclamoList[0]);
      //Ottengo i dati della fornituraCausaReclamo
      let mappedFornituraCausaReclamo = [];
      fornituraCausaReclamoList.forEach((fornituraCausaReclamo) => {
        let objFornituraCausaReclamo = {};
        let campi = [];
        Object.keys(fornituraCausaReclamo).forEach((campo) => {
          const value = fornituraCausaReclamo[campo];
          if (campo.startsWith("partitaCausaReclamo_"))
            objFornituraCausaReclamo = {
              ...objFornituraCausaReclamo,
              [campo.replace("partitaCausaReclamo_", "")]: value,
            };
          if (columnsData.find((x) => x.codice === campo) && isNumber(value)) {
            const keyCampoReso = campo + "_includiNelReso";
            const altriCampi = Object.keys(fornituraCausaReclamo);
            const campoReso = altriCampi.find((x) => x === keyCampoReso);
            const rendi =
              campoReso !== undefined
                ? fornituraCausaReclamo[campoReso]
                : false;
            campi = [...campi, { campo: campo, value: value, rendi: rendi }];
          }
        });
        objFornituraCausaReclamo = {
          ...objFornituraCausaReclamo,
          campoList: campi,
        };
        mappedFornituraCausaReclamo = [
          ...mappedFornituraCausaReclamo,
          objFornituraCausaReclamo,
        ];
      });
      fornituraData = {
        ...fornituraData,
        causaList: mappedFornituraCausaReclamo,
      };
      fornituraList = [...fornituraList, fornituraData];
    });
    console.log("fornituraList", fornituraList);
    return fornituraList;
  };

  const assegnaIndex = (items) => {
    return items.map((item, index) => ({
      ...item,
      partitaCausaReclamo_index: index,
    }));
  };

  const groupBy = (items, key) =>
    items.reduce(
      (result, item) => ({
        ...result,
        [item[key]]: [...(result[item[key]] || []), item],
      }),
      {}
    );

  const salvaValori = () => {
    const fornituraList = mappaPartitaGroupsToObjectBackend(
      groupBy(assegnaIndex(data), "codice")
    );
    const obj = {
      id: idReclamo,
      idForm: idForm,
      valorizzazioneTotaleValuta: valorizzazioneTotaleValuta,
      valorizzazioneTotaleClienteValuta: valorizzazioneTotaleClienteValuta,
      partitaList: fornituraList,
    };
    if (idReclamo === undefined) {
      onSubmit(obj);
      return;
    }
    instance
      .post(getApiUrl() + "api/reclamo/updateFornitura", obj)
      .then((response) => {
        mandaNotifica("Fornitura aggiornata correttamente", "success");
        const responseData = response.data;
        const fornitureCausaReclamoCreate =
          responseData.fornitureCausaReclamoCreate;
        let dataFinale = [];
        data.map((d, index) => {
          const objFinded = fornitureCausaReclamoCreate.find(
            (x) => x.index === index
          );
          if (objFinded !== undefined) {
            d = {
              ...d,
              id: objFinded.idFornitura,
              partitaCausaReclamo_id: objFinded.idFornituraCausaReclamo,
            };
          }
          dataFinale = [...dataFinale, d];
        });
        setData(dataFinale);
        onSubmit(dataFinale, responseData);
        //trigger({ id: router.query.slug });
      })
      .catch(() =>
        mandaNotifica("Impossibile aggiornare la fornitura", "error")
      );
  };

  //TODO

  const onSubmitAggiungiPartita = (partitaList) => {
    //Qua avrò una lista di qualcosa che devo convertire per utilizzarlo
    const transformed = fromDefToTransformed(partitaList);
    const newData = [...data, ...transformed];
    newData.sort(function (a, b) {
      return ("" + a.codice).localeCompare(b.codice);
    });
    valorizzazioneTotale(newData);
    setData(newData);
    setDialogAggiungiOpen(false);
  };

  const onSubmitCopiaPartita = (index) => {
    let riga = data[index];
    riga = {
      ...riga,
      partitaCausaReclamo_id: null,
      partitaCausaReclamo_evidenzaList: [],
    };
    const tempList = [...data, riga];
    tempList.sort(function (a, b) {
      return ("" + a.codice).localeCompare(b.codice);
    });
    valorizzazioneTotale(tempList);
    setData(tempList);
  };

  const onSubmitEliminaPartita = (indexList) => {
    const newData = data.filter(
      (d, index) => indexList.find((x) => x === index) === undefined
    );
    valorizzazioneTotale(newData);
    setData(newData);
  };
  //Inizialmente era width: window.innerWidth - 160
  return (
    <Stack
      direction={"column"}
      spacing={1}
      p={1}
      sx={{ width: window.innerWidth - (widthOffset ? widthOffset : 169) }}
    >
      <Paper square>
        <Stack direction={"column"} p={1}>
          <Typography variant="button">Gestisci la fornitura</Typography>
          <Stack direction={"row"} spacing={1}>
            <Button
              variant="contained"
              onClick={() => salvaValori()}
              startIcon={<SaveIcon />}
              size="large"
              disabled={!abilitaModifica || data.length === 0}
            >
              Salva
            </Button>
            {modificaLista ? (
              <>
                <Button
                  variant="outlined"
                  onClick={() => setDialogAggiungiOpen(true)}
                  startIcon={<AddIcon />}
                  size="small"
                  disabled={!abilitaModifica}
                >
                  Aggiungi partite
                </Button>
                <Button
                  variant="outlined"
                  color="info"
                  onClick={() => setDialogCopiaOpen(true)}
                  startIcon={<ContentCopyIcon />}
                  size="small"
                  disabled={!abilitaModifica}
                >
                  Copia
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => setDialogEliminaOpen(true)}
                  startIcon={<RemoveIcon />}
                  size="small"
                  disabled={!abilitaModifica}
                >
                  Elimina
                </Button>
              </>
            ) : null}
          </Stack>
        </Stack>
      </Paper>
      <TableContainer>
        <Table>
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => (
                  <TableCell key={header.id} style={getStyleSticky(index)}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell, index) => (
                  <TableCell key={cell.id} p={0} style={getStyleSticky(index)}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Stack direction={"row"} spacing={1}>
        <TextField
          variant="outlined"
          value={valorizzazioneTotaleValuta}
          label={"Valorizzazione totale(" + codiceValuta + ")"}
          size="small"
          InputProps={{
            readOnly: true,
          }}
          fullWidth
        />
        <Divider />
        <TextField
          variant="outlined"
          value={valorizzazioneTotaleClienteValuta || ""}
          label={"Valorizzazione totale CLIENTE (" + codiceValuta + ")"}
          size="small"
          InputProps={{
            readOnly: true,
          }}
          fullWidth
        />
      </Stack>
      <Divider />
      {/*<pre>{JSON.stringify(data, null, "\t")}</pre>*/}
      <DialogAggiungiPartita
        opened={dialogAggiungiOpen}
        handleClose={() => setDialogAggiungiOpen(false)}
        handleOnSubmit={onSubmitAggiungiPartita}
        partitaList={data}
        columnsData={columnsData}
      />
      <DialogCopiaPartita
        opened={dialogCopiaOpen}
        handleClose={() => setDialogCopiaOpen(false)}
        handleOnSubmit={onSubmitCopiaPartita}
        partitaList={data}
      />
      <DialogEliminaPartita
        opened={dialogEliminaOpen}
        handleClose={() => setDialogEliminaOpen(false)}
        handleOnSubmit={onSubmitEliminaPartita}
        partitaList={data}
      />
      <DialogInfo
        opened={dialogInfoOpen}
        infoData={infoSelezionato}
        codiceValuta={codiceValuta}
        handleClose={() => setDialogInfoOpen(false)}
      />
    </Stack>
  );
}
