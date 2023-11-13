import {
  Badge,
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  Stack,
  Tooltip,
} from "@mui/material";

import SelectCambiaFase from "../selectCambiaFase";
import ShareIcon from "@mui/icons-material/Share";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import useFaseSelettore from "../fetching/useFaseSelettore";
import getApiUrl from "../../utils/BeUrl";
import DialogCondivisioneUtenti from "../condivisioneUtente/DialogCondivisioneUtenti";
import GetCurrentAxiosInstance from "../../utils/Axios";
import { mandaNotifica } from "../../utils/ToastUtils";
import TagIcon from "@mui/icons-material/Tag";
import DialogAssegnaTag from "../assegnaTag/dialogAssegnaTag";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import DialogCreaNotaAccredito from "../creaNotaAccredito/dialogCreaNotaAccredito";
import { Typography } from "@mui/material";
import Tag from "../tag";
import DialogCreaReso from "../reso/dialogCreaReso";
import AssignmentReturnedIcon from "@mui/icons-material/AssignmentReturned";
import DialogDownloadReportReclami from "../downloadReportReclami/dialogDownloadReportReclami";
import SummarizeIcon from "@mui/icons-material/Summarize";
export default function ReclamiCustomToolbar({
  selectedRows,
  displayData,
  setSelectedRows,
  onUpdateReclami,
}) {
  const [reclamiSelezionati, setReclamiSelezionati] = useState([]);
  const [openedDialogCondivisione, setOpenedDialogCondivisione] =
    useState(false);

  const [openedDialogTags, setOpenedDialogTags] = useState(false);
  const [openedDialogCreaReso, setOpenedDialogCreaReso] = useState(false);
  const [openedDialogCreaNotaAccredito, setOpenedDialogCreaNotaAccredito] =
    useState(false);
  const [
    openedDialogDownloadReportReclami,
    setOpenedDialogDownloadReportReclami,
  ] = useState(false);
  const handleClickOpen = () => {
    setOpenedDialogCondivisione(true);
  };

  const handleClose = () => {
    setOpenedDialogCondivisione(false);
    onUpdateReclami();
  };

  const handleClickOpenTags = () => {
    setOpenedDialogTags(true);
  };

  const handleCloseOpenTags = () => {
    setOpenedDialogTags(false);
    onUpdateReclami();
  };

  const handleClickOpenDialogCreaReso = () => {
    setOpenedDialogCreaReso(true);
  };

  const handleClickCloseDialogCreaReso = () => {
    setOpenedDialogCreaReso(false);
  };

  const handleClickOpenDialogCreaNotaAccredito = () => {
    setOpenedDialogCreaNotaAccredito(true);
  };

  const handleClickCloseDialogCreaNotaAccredito = () => {
    setOpenedDialogCreaNotaAccredito(false);
  };

  const handleClickOpenDialogDownloadReportReclami = () => {
    setOpenedDialogDownloadReportReclami(true);
  };

  const handleClickCloseDialogDownloadReportReclami = () => {
    setOpenedDialogDownloadReportReclami(false);
  };

  const instance = GetCurrentAxiosInstance();

  useEffect(() => {
    let arr = [];
    const keys = selectedRows.data;
    for (let i = 0; i < keys.length; i++) {
      const index = keys[i].index;
      const record = displayData[index];
      if (record !== undefined) arr = [...arr, record.data];
    }
    setReclamiSelezionati(arr);
  }, [selectedRows]);

  const tuttiStessaFase = () => {
    let map = {};
    for (let i = 0; i < reclamiSelezionati.length; i++) {
      map = { ...map, [reclamiSelezionati[i][2]]: true };
    }
    return Object.keys(map).length == 1;
  };

  const tuttiStessoCliente = () => {
    let map = {};
    for (let i = 0; i < reclamiSelezionati.length; i++) {
      map = { ...map, [reclamiSelezionati[i][11]]: true };
    }
    return Object.keys(map).length == 1;
  };

  const tuttiStessaValuta = () => {
    let map = {};
    for (let i = 0; i < reclamiSelezionati.length; i++) {
      map = { ...map, [reclamiSelezionati[i][19]]: true };
    }
    return Object.keys(map).length == 1;
  };

  const tuttiStessoForm = () => {
    let map = {};
    for (let i = 0; i < reclamiSelezionati.length; i++) {
      map = { ...map, [reclamiSelezionati[i][18]]: true };
    }
    return Object.keys(map).length == 1;
  };

  const { fasiList, isValidating, mutate } = useFaseSelettore(
    tuttiStessaFase() ? reclamiSelezionati[0][2] : null
  );

  useEffect(() => {
    mutate();
  }, [reclamiSelezionati]);

  const handleOnCondividiSubmit = (list) => {
    const idReclamoList = reclamiSelezionati.map((reclamo) => reclamo[0]);
    const idUtenteList = list.map((utente) => utente.id);
    instance
      .post(getApiUrl() + "api/reclamo/condividi", {
        idReclamoList: idReclamoList,
        idUtenteList: idUtenteList,
      })
      .then(() => {
        mandaNotifica("Reclamo condiviso correttamente", "success");
        onUpdateReclami();
        handleClose();
      })
      .catch(() =>
        mandaNotifica("Impossibile condividere il reclamo", "error")
      );
  };

  const handleOnTagsSubmit = (list) => {
    const idReclamoList = reclamiSelezionati.map((reclamo) => reclamo[0]);
    instance
      .post(getApiUrl() + "api/reclamo/associaTag", {
        idReclamoList: idReclamoList,
        tags: list.tags,
      })
      .then(() => {
        mandaNotifica("Tags associati correttamente", "success");
        onUpdateReclami();
        handleCloseOpenTags();
      })
      .catch(() => mandaNotifica("Impossibile associare i tags", "error"));
  };

  const handleCreaResoSubmit = (data) => {
    instance
      .post(getApiUrl() + "api/reclamo/nuovoReso", data)
      .then(() => {
        mandaNotifica("Reso salvato con successo", "success");
        onUpdateReclami();
        handleClickCloseDialogCreaReso();
      })
      .catch(() =>
        mandaNotifica("Non è stato possibile salvare il reso", "error")
      );
  };

  const handleCreaNotaAccreditoSubmit = (data) => {
    data = {
      ...data,
      fornituraCausaReclamoList: data.fornituraCausaReclamoList.map((x) => ({
        id: x.id,
        valoreEuro: x.valoreContestazioneEuro,
      })),
    };
    instance
      .post(getApiUrl() + "api/reclamo/nuovaNotaAccredito", data)
      .then(() => {
        mandaNotifica("Nota accredito salvata con successo", "success");
        onUpdateReclami();
        handleClickCloseDialogCreaNotaAccredito();
      })
      .catch(() =>
        mandaNotifica(
          "Non è stato possibile salvare la nota accredito",
          "error"
        )
      );
  };

  const onUpdateReclamiHere = (result) => {
    if (result.data === true) handleClickOpen();
    //Chiamo padre che aggiorna i reclami
    else onUpdateReclami();
  };

  const getIdReclamoList = (reclamiSelezionati) => {
    if (reclamiSelezionati === undefined || reclamiSelezionati.length === 0)
      return [];
    return reclamiSelezionati.map((reclamo) => {
      return reclamo[0];
    });
  };

  const isResoDisabilitato = () => {
    return !tuttiStessoForm() || !tuttiStessoCliente();
  };

  const isNotaCreditoDisabilitata = () => {
    return (
      !tuttiStessoCliente(reclamiSelezionati) ||
      !tuttiStessaValuta(reclamiSelezionati)
    );
  };

  const displayForniturePerStatoFornitura = () => {
    if (reclamiSelezionati === undefined) return;
    const fornituraList = reclamiSelezionati
      .flatMap((x) => x[23])
      .flatMap((x) => x.causaReclamoList);
    const perStatiFornitura = fornituraList.reduce((group, fornitura) => {
      const { idStato } = fornitura;
      group[idStato] = group[idStato] ?? [];
      group[idStato].push(fornitura);
      return group;
    }, {});
    const arr = Object.keys(perStatiFornitura).sort((a, b) => a - b);
    return (
      <Stack spacing={0.5} direction={"column"}>
        {arr.map((stato) => (
          <Chip
            label={
              perStatiFornitura[stato][0].codiceStato +
              " (" +
              perStatiFornitura[stato].length +
              ")"
            }
            variant="outlined"
            size="small"
          />
        ))}
        <Chip
          label={"TOTALE (" + fornituraList.length + ")"}
          variant="outlined"
          size="small"
          color="primary"
        />
      </Stack>
    );
  };

  return (
    <Stack
      direction={"row"}
      spacing={1}
      justifyContent="flex-start"
      alignItems="center"
      pr={2}
    >
      {displayForniturePerStatoFornitura()}
      <Divider orientation="vertical" flexItem />
      {fasiList !== undefined &&
      fasiList.length > 0 &&
      reclamiSelezionati !== undefined &&
      reclamiSelezionati.length > 0 ? (
        <SelectCambiaFase
          reclamiList={reclamiSelezionati}
          onUpdateReclami={onUpdateReclamiHere}
          fl={fasiList}
          idFase={reclamiSelezionati[0][2]}
        />
      ) : (
        <></>
      )}
      <Divider orientation="vertical" flexItem />
      <Tooltip title="Condividi">
        <IconButton
          aria-label="share"
          size="small"
          onClick={() => handleClickOpen()}
          color="info"
        >
          <ShareIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Assegna tag">
        <IconButton
          aria-label="delete"
          size="small"
          onClick={() => handleClickOpenTags()}
        >
          <TagIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Genera report">
        <IconButton
          aria-label="generate report"
          size="small"
          color="error"
          onClick={() => {
            handleClickOpenDialogDownloadReportReclami();
          }}
        >
          <SummarizeIcon />
        </IconButton>
      </Tooltip>
      <Tooltip
        title={
          isResoDisabilitato()
            ? "I reclami selezionati devono avere tutti lo stesso form e lo stesso cliente"
            : "Crea reso"
        }
      >
        <span>
          <IconButton
            aria-label="crea reso"
            size="small"
            onClick={() => handleClickOpenDialogCreaReso()}
            color="secondary"
            disabled={isResoDisabilitato()}
          >
            <AssignmentReturnedIcon />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip
        title={
          isNotaCreditoDisabilitata()
            ? "I reclami selezionati devono avere tutti la stessa valuta e lo stesso cliente"
            : "Crea nota accredito"
        }
      >
        <span>
          <IconButton
            aria-label="crea nota accredito"
            size="small"
            onClick={() => handleClickOpenDialogCreaNotaAccredito()}
            color="success"
            disabled={isNotaCreditoDisabilitata()}
          >
            <RequestQuoteIcon />
          </IconButton>
        </span>
      </Tooltip>
      <DialogCondivisioneUtenti
        opened={openedDialogCondivisione}
        handleClickOpen={handleClickOpen}
        handleClose={handleClose}
        handleOnSubmit={handleOnCondividiSubmit}
      />
      <DialogAssegnaTag
        opened={openedDialogTags}
        handleClose={handleCloseOpenTags}
        handleOnSubmit={handleOnTagsSubmit}
      />
      <DialogCreaReso
        opened={openedDialogCreaReso}
        handleClose={handleClickCloseDialogCreaReso}
        handleOnSubmit={handleCreaResoSubmit}
        idReclamoList={getIdReclamoList(reclamiSelezionati)}
      />
      <DialogCreaNotaAccredito
        opened={openedDialogCreaNotaAccredito}
        handleClose={handleClickCloseDialogCreaNotaAccredito}
        handleOnSubmit={handleCreaNotaAccreditoSubmit}
        idReclamoList={getIdReclamoList(reclamiSelezionati)}
      />
      <DialogDownloadReportReclami
        opened={openedDialogDownloadReportReclami}
        handleClose={handleClickCloseDialogDownloadReportReclami}
        idReclamoList={getIdReclamoList(reclamiSelezionati)}
      />
    </Stack>
  );
}
