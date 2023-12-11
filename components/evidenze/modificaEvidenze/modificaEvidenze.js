import React, { useEffect, useState } from "react";
import { Stack, Paper, Typography, Button } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import EvidenzaTableCell from "./EvidenzaTableCell";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import useCategoriaEvidenzaSelect from "../../fetching/useCategoriaEvidenzaSelect";
import useTipologiaStatoEvidenzaSelect from "../../fetching/useTipologiaStatoEvidenzaSelect";
import dayjs from "dayjs";
import DialogAllegati from "../dialogAllegati/dialogAllegati";
import GetCurrentAxiosInstance from "../../../utils/Axios";
import getApiUrl from "../../../utils/BeUrl";
import { mandaNotifica } from "../../../utils/ToastUtils";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DialogEliminaEvidenza from "./dialogEliminaEvidenza";
import DialogAggiungiEvidenza from "./dialogAggiungiEvidenza";
import DialogStatiEvidenza from "./dialogStatiEvidenza";
export default function ModificaEvidenze({
  evidenzaList,
  fornituraList = [],
  onSalva,
  isSalva = false,
  abilitaModifica = false,
}) {
  const instance = GetCurrentAxiosInstance();
  const columnHelper = createColumnHelper();
  const { data: categoriaList } = useCategoriaEvidenzaSelect();
  const { data: tipologiaStatoEvidenzaList } =
    useTipologiaStatoEvidenzaSelect();

  const generaColonne = () => {
    let colonne = [];
    colonne = [
      ...colonne,
      columnHelper.accessor("codiceFornitura", {
        header: "Partita",
        cell: EvidenzaTableCell,
        meta: {
          type: "LABEL",
          options: [],
        },
      }),
    ];
    colonne = [
      ...colonne,
      columnHelper.accessor("codiceCausaReclamo", {
        header: "Causa",
        cell: EvidenzaTableCell,
        meta: {
          type: "CAUSA_RECLAMO",
          options: [],
        },
      }),
    ];
    colonne = [
      ...colonne,
      columnHelper.accessor("idCategoria", {
        header: "Categoria",
        cell: EvidenzaTableCell,
        meta: {
          type: "SELECT",
          options: categoriaList,
        },
      }),
    ];
    colonne = [
      ...colonne,
      columnHelper.accessor("idStato", {
        header: "Stato",
        cell: EvidenzaTableCell,
        meta: {
          type: "SELECT",
          options: tipologiaStatoEvidenzaList,
        },
      }),
    ];
    colonne = [
      ...colonne,
      columnHelper.accessor("timestampStato", {
        header: "Data",
        cell: EvidenzaTableCell,
        meta: {
          type: "DATE",
          options: [],
        },
      }),
    ];
    colonne = [
      ...colonne,
      columnHelper.accessor("note", {
        header: "Note",
        cell: EvidenzaTableCell,
        meta: {
          type: "TEXT",
          options: [],
        },
      }),
    ];
    colonne = [
      ...colonne,
      columnHelper.accessor("allegatoList", {
        header: "Allegati",
        cell: EvidenzaTableCell,
        meta: {
          type: "ALLEGATOLIST",
          options: [],
        },
      }),
    ];
    return colonne;
  };

  const [dialogAllegati, setDialogAllegati] = useState(false);
  const [dialogAllegatiData, setDialogAllegatiData] = useState(undefined);
  const [dialogAggiungiOpen, setDialogAggiungiOpen] = useState(false);
  const [dialogEliminaOpen, setDialogEliminaOpen] = useState(false);
  const [dialogStatiEvidenzaOpen, setDialogStatiEvidenzaOpen] = useState(false);
  const [dialogStatiEvidenzaData, setDialogStatiEvidenzaData] =
    useState(undefined);

  const openDialogAllegati = () => {
    setDialogAllegati(true);
  };

  const closeDialogAllegati = () => {
    setDialogAllegati(false);
  };

  const openDialogStatiEvidenza = () => {
    setDialogStatiEvidenzaOpen(true);
  };

  const closeDialogStatiEvidenza = () => {
    setDialogStatiEvidenzaOpen(false);
  };

  const [data, setData] = useState([]);

  useEffect(() => {
    setData(evidenzaList);
  }, [evidenzaList]);

  const updateValueOfData = (rowIndex, columnId, value) => {
    setData((old) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            [columnId]: value,
          };
        }
        return row;
      })
    );
  };

  const modificaValuesStato = (row, column, value, _meta) => {
    const rowIndex = row.index;
    const columnId = column.id;
    updateValueOfData(rowIndex, columnId, value.value);
    updateValueOfData(rowIndex, "timestampStato", dayjs());
  };

  const modificaAltriValues = (row, column, value, _meta) => {
    const rowIndex = row.index;
    const columnId = column.id;
    if (value && value !== null && value.value)
      updateValueOfData(rowIndex, columnId, value.value);
    else updateValueOfData(rowIndex, columnId, value);
  };

  const table = useReactTable({
    data,
    columns: generaColonne(),
    getCoreRowModel: getCoreRowModel(),
    meta: {
      updateData: (row, column, value, meta) => {
        //Se sono lo stato cambio anche la data, altrimenti cambio solo il mio value
        if (column.id === "idStato")
          modificaValuesStato(row, column, value, meta);
        else modificaAltriValues(row, column, value, meta);
      },
      onAggiungiAllegatoClick: (row, column, meta) => {
        setDialogAllegatiData({
          id: null,
          descrizione: null,
          filename: null,
          tempIndex: null,
          row,
          column,
          meta,
        });
        openDialogAllegati(true);
      },
      onApriAllegatoClick: (row, column, meta, allegato, allegatoIndex) => {
        setDialogAllegatiData({
          ...allegato,
          tempIndex: allegatoIndex,
          row,
          column,
          meta,
        });
        openDialogAllegati(true);
      },
      onRimuoviAllegatoClick: (
        row,
        column,
        _meta,
        _allegato,
        allegatoIndex
      ) => {
        const rowIndex = row.index;
        const columnId = column.id;
        let allegatoList = data[rowIndex][columnId];
        allegatoList = allegatoList.filter(
          (_old, index) => index !== allegatoIndex
        );
        setData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex],
                [columnId]: allegatoList,
              };
            }
            return row;
          })
        );
      },
      onStoricoButtonClick: (evidenza) => {
        setDialogStatiEvidenzaData(evidenza);
        openDialogStatiEvidenza();
      },
    },
  });

  const onSubmitDialogAllegati = (values) => {
    const rowIndex = values.row.index;
    const columnId = values.column.id;
    let allegatoList = data[rowIndex][columnId];
    if (values.tempIndex === null) {
      allegatoList = [...allegatoList, values];
    } else
      allegatoList = allegatoList.map((old, index) =>
        index === values.tempIndex ? values : old
      );
    setData((old) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            [columnId]: allegatoList,
          };
        }
        return row;
      })
    );
    closeDialogAllegati();
    setDialogAllegatiData(undefined);
  };

  const onSubmitAggiungiEvidenza = (values) => {
    setData((old) => [
      ...old,
      {
        codiceFornitura: values.codiceFornitura,
        idFornituraCausaReclamo: values.idFornituraCausaReclamo,
        codiceCausaReclamo: values.codiceCausaReclamo,
        allegatoList: [],
      },
    ]);
  };

  const onSubmitEliminaEvidenza = (indexList) => {
    const newData = data.filter(
      (d, index) => indexList.find((x) => x === index) === undefined
    );
    setData(newData);
  };

  const salvaValori = () => {
    const finalData = data.map((riga) => ({
      ...riga,
      timestampStato: dayjs(riga.timestampStato).format("DD/MM/YYYY"),
    }));
    if (isSalva) {
      onSalva(finalData);
      return;
    }
    const formData = new FormData();
    formData.append(
      "ddd",
      new Blob([JSON.stringify(finalData)], {
        type: "application/json",
      })
    );

    const files = finalData.flatMap((ev) =>
      ev.allegatoList.map((al) => al.file)
    );
    files.forEach((file) => {
      formData.append("files", file);
    });
    instance
      .post(getApiUrl() + "api/reclamo/updateEvidenze", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        mandaNotifica("Evidenze aggiornate correttamente", "success");
        onSalva();
      })
      .catch((error) => {
        console.log("error", error);
        mandaNotifica(
          "Si sono verificati errori nel salvataggio delle evidenze",
          "error"
        );
      });
  };

  return (
    <Stack direction={"column"} spacing={1} p={1}>
      <Paper>
        <Stack direction={"column"} p={1}>
          <Typography variant="button">Gestisci evidenze</Typography>
          <Stack direction={"row"} width={"100%"} spacing={1}>
            <Button
              variant="contained"
              onClick={() => salvaValori()}
              startIcon={<SaveIcon />}
              size="large"
              disabled={!abilitaModifica}
            >
              Salva
            </Button>
            {!isSalva ? (
              <>
                <Button
                  variant="outlined"
                  onClick={() => setDialogAggiungiOpen(true)}
                  startIcon={<AddIcon />}
                  size="small"
                  disabled={!abilitaModifica}
                >
                  Aggiungi
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
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header, _index) => (
                    <TableCell key={header.id}>
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
                  {row.getVisibleCells().map((cell, _index) => (
                    <TableCell key={cell.id} p={0}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      {/*<pre>{JSON.stringify(data, null, "\t")}</pre>*/}
      <DialogAllegati
        opened={dialogAllegati}
        handleClose={closeDialogAllegati}
        handleOnSubmit={onSubmitDialogAllegati}
        allegato={dialogAllegatiData}
      />
      <DialogAggiungiEvidenza
        opened={dialogAggiungiOpen}
        handleClose={() => setDialogAggiungiOpen(false)}
        handleOnSubmit={onSubmitAggiungiEvidenza}
        dataList={fornituraList}
      />
      <DialogEliminaEvidenza
        opened={dialogEliminaOpen}
        handleClose={() => setDialogEliminaOpen(false)}
        handleOnSubmit={onSubmitEliminaEvidenza}
        dataList={data}
      />
      <DialogStatiEvidenza
        opened={dialogStatiEvidenzaOpen}
        handleClose={closeDialogStatiEvidenza}
        evidenza={dialogStatiEvidenzaData}
      />
    </Stack>
  );
}
