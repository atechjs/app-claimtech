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
import DialogModificaRateo from "../modificaRateo/dialogModificaRateo";
import ChipValorizzazioneValuta from "../chipValorizzazioneValuta";
import ChipValorizzazioneEuro from "../chipValorizzazioneEuro";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import DialogCreaProposta from "../proposta/dialogCreaProposta";
import DialogCondivisioneUtenti from "../condivisioneUtente/dialogCondivisioneUtenti";
import { convertiInEuro } from "../../utils/valutaUtils";

export default function ReclamiCustomToolbar({
  selectedRows,
  displayData,
  setSelectedRows,
  onUpdateReclami,
}) {
  //COSTANTI DI ACCESSO AI CAMPI
  const INDEX_ID = 0;
  const INDEX_FASE = 2;
  const INDEX_CLIENTE = 12;
  const INDEX_VALORIZZAZIONE_VALUTA = 17;
  const INDEX_FORM = 19;
  const INDEX_VALUTA = 20;
  const INDEX_ID_FORNITURA_LIST = 24;
  const INDEX_MODIFICA_ABILITATA = 28;
  const INDEX_VALORIZZAZIONE_EURO = 30;

  const [reclamiSelezionati, setReclamiSelezionati] = useState([]);
  const [openedDialogCondivisione, setOpenedDialogCondivisione] =
    useState(false);

  const [openedDialogTags, setOpenedDialogTags] = useState(false);
  const [openedDialogRateo, setOpenedDialogRateo] = useState(false);
  const [openedDialogProposta, setOpenedDialogProposta] = useState(false);
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

  const handleClickOpenDialogRateo = () => {
    setOpenedDialogRateo(true);
  };

  const handleClickCloseDialogRateo = () => {
    setOpenedDialogRateo(false);
  };

  const handleClickOpenNuovaPropostaTcs = () => {
    setOpenedDialogProposta(true);
  };

  const handleClickCloseNuovaPropostaTcs = () => {
    setOpenedDialogProposta(false);
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
      map = { ...map, [reclamiSelezionati[i][INDEX_FASE]]: true };
    }
    return Object.keys(map).length == 1;
  };

  const tuttiStessoCliente = () => {
    let map = {};
    for (let i = 0; i < reclamiSelezionati.length; i++) {
      map = { ...map, [reclamiSelezionati[i][INDEX_CLIENTE]]: true };
    }
    return Object.keys(map).length == 1;
  };

  const tuttiStessaValuta = () => {
    let map = {};
    for (let i = 0; i < reclamiSelezionati.length; i++) {
      map = { ...map, [reclamiSelezionati[i][INDEX_VALUTA]]: true };
    }
    return Object.keys(map).length == 1;
  };

  const tuttiStessoForm = () => {
    let map = {};
    for (let i = 0; i < reclamiSelezionati.length; i++) {
      map = { ...map, [reclamiSelezionati[i][INDEX_FORM]]: true };
    }
    return Object.keys(map).length == 1;
  };

  const tuttiModificaAbilitata = () => {
    for (let i = 0; i < reclamiSelezionati.length; i++) {
      if (!reclamiSelezionati[i][INDEX_MODIFICA_ABILITATA]) return false;
    }
    return true;
  };

  const getCodiceValuta = () => {
    if (!reclamiSelezionati || reclamiSelezionati.length === 0) return "";
    return reclamiSelezionati[0][INDEX_VALUTA];
  };

  const { fasiList, isValidating, mutate } = useFaseSelettore(
    tuttiStessaFase() ? reclamiSelezionati[0][2] : null
  );

  useEffect(() => {
    mutate();
  }, [reclamiSelezionati]);

  const handleOnCondividiSubmit = (obj) => {
    const idReclamoList = reclamiSelezionati.map(
      (reclamo) => reclamo[INDEX_ID]
    );
    const inviaMail = obj.inviaMail;
    const list = obj.list;
    const idUtenteList = list.map((utente) => utente.id);
    instance
      .post(getApiUrl() + "api/reclamo/condividi", {
        idReclamoList: idReclamoList,
        idUtenteList: idUtenteList,
        inviaMail: inviaMail,
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
    const idReclamoList = reclamiSelezionati.map(
      (reclamo) => reclamo[INDEX_ID]
    );
    instance
      .post(getApiUrl() + "api/reclamo/associaTag", {
        idReclamoList: idReclamoList,
        assegna: list.assegna,
        tags: list.tags,
      })
      .then(() => {
        mandaNotifica(
          list.assegna
            ? "Tags associati correttamente"
            : "Tags rimossi correttamente",
          "success"
        );
        onUpdateReclami();
        handleCloseOpenTags();
      })
      .catch(() =>
        mandaNotifica(
          list.assegna
            ? "Impossibile associare i tags"
            : "Impossibile rimuovere i tags",
          "error"
        )
      );
  };

  const handleOnModificaRateo = (data) => {
    const idReclamoList = reclamiSelezionati.map(
      (reclamo) => reclamo[INDEX_ID]
    );
    instance
      .post(getApiUrl() + "api/reclamo/modificaIncludiNelRateo", {
        idReclamoList: idReclamoList,
        includiRateo: data.includiRateo,
        esercizioRateo: data.esercizioRateo,
      })
      .then(() => {
        mandaNotifica("Campo includi nel rateo aggiornato", "success");
        handleClickCloseDialogRateo();
      })
      .catch((error) =>
        mandaNotifica("Impossibile aggiornare il rateo", "error")
      );
  };

  const handleCreaResoSubmit = (data) => {
    const formData = new FormData();
    formData.append("fileReso", data.fileReso);
    formData.append("fileCmr", data.fileCmr);
    formData.append(
      "data",
      new Blob([JSON.stringify(data)], {
        type: "application/json",
      })
    );
    instance
      .post(getApiUrl() + "api/reclamo/nuovoReso", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
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

  const onSubmitProposta = () => {
    onUpdateReclami();
    handleClickCloseNuovaPropostaTcs();
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

  const displaySommaValorizzazioni = () => {
    if (reclamiSelezionati === undefined) return;
    let mapped = [];
    reclamiSelezionati.forEach((reclamo) => {
      const codiceValuta = reclamo[INDEX_VALUTA];
      const partitaList = reclamo[INDEX_ID_FORNITURA_LIST];
      partitaList.forEach((partita) =>
        partita.causaReclamoList.map((fornituraCausaReclamo) => {
          const obj = {
            id: fornituraCausaReclamo.id,
            codice: partita.codice,
            valoreContestazione: fornituraCausaReclamo.valoreContestazione,
            idStato: fornituraCausaReclamo.idStato,
            codiceStato: fornituraCausaReclamo.codiceStato,
            cambioValuta: partita.cambioValuta,
            codiceValuta: codiceValuta,
          };
          mapped = [...mapped, obj];
        })
      );
    });
    const perStatiFornitura = mapped.reduce((group, fornitura) => {
      const { idStato } = fornitura;
      group[idStato] = group[idStato] ?? [];
      group[idStato].push(fornitura);
      return group;
    }, {});

    const arr = Object.keys(perStatiFornitura).sort((a, b) => a - b);
    let totaleTotaleEuro = 0;
    let totaleTotaleLength = 0;
    let totaleTotaleValute = [];
    return (
      <Stack direction={"column"}>
        <Typography variant="button">Resoconto</Typography>
        <Stack spacing={0.5} direction={"column"}>
          {arr.map((idStato) => {
            const arrObj = perStatiFornitura[idStato];
            const codiceStato = arrObj[0].codiceStato;
            const numForniture = arrObj.length;
            //Calcolo i totali per valuta
            const raggruppamentoValuta = arrObj.reduce((group, fornitura) => {
              const { codiceValuta } = fornitura;
              group[codiceValuta] = group[codiceValuta] ?? [];
              group[codiceValuta].push(fornitura);
              return group;
            }, {});

            const arrValute = Object.keys(raggruppamentoValuta).sort(
              (a, b) => a - b
            );
            let arrDaVisualizzare = [];
            let totaleEuro = 0;
            arrValute.map((codValuta) => {
              let sum = 0;
              const arrObjValute = raggruppamentoValuta[codValuta];
              arrObjValute.forEach((objValuta) => {
                totaleEuro += convertiInEuro(
                  objValuta.valoreContestazione,
                  objValuta.cambioValuta
                );
                sum += objValuta.valoreContestazione;
              });
              arrDaVisualizzare = [
                ...arrDaVisualizzare,
                { codiceValuta: codValuta, sum: sum },
              ];
            });
            totaleTotaleEuro += totaleEuro;
            totaleTotaleLength += numForniture;
            arrDaVisualizzare.forEach((sumValuta) => {
              let valFind = totaleTotaleValute.find(
                (x) => x.codiceValuta === sumValuta.codiceValuta
              );
              if (valFind !== undefined) {
                valFind = { ...valFind, sum: valFind.sum + sumValuta.sum };
                const temp = totaleTotaleValute.filter(
                  (x) => x.codiceValuta !== valFind.codiceValuta
                );
                totaleTotaleValute = [...temp, valFind];
              } else {
                totaleTotaleValute = [...totaleTotaleValute, sumValuta];
              }
            });
            return (
              <Stack direction={"row"} spacing={1} width={"100%"}>
                <Stack
                  direction={"row"}
                  alignItems={"start"}
                  justifyContent={"start"}
                >
                  <Chip
                    label={codiceStato + "(" + numForniture + ")"}
                    variant="outlined"
                    size="small"
                  />
                </Stack>
                <Stack
                  direction={"row"}
                  alignItems={"start"}
                  justifyContent={"end"}
                  width={"100%"}
                  spacing={1}
                >
                  {arrDaVisualizzare
                    .filter((x) => x.codiceValuta !== "EUR")
                    .map((counter) => (
                      <ChipValorizzazioneValuta
                        valorizzazione={counter.sum}
                        codiceValuta={counter.codiceValuta}
                      />
                    ))}
                  <ChipValorizzazioneEuro valorizzazione={totaleEuro} />
                </Stack>
              </Stack>
            );
          })}
          <Divider flexItem />
          <Stack direction={"row"} spacing={1} width={"100%"}>
            <Stack
              direction={"row"}
              alignItems={"start"}
              justifyContent={"start"}
            >
              <Chip
                label={"TOTALE (" + totaleTotaleLength + ")"}
                variant="outlined"
                size="small"
                color="primary"
              />
            </Stack>
            <Stack
              direction={"row"}
              alignItems={"flex-start"}
              justifyContent={"end"}
              width={"100%"}
              spacing={1}
            >
              {totaleTotaleValute
                .filter((x) => x.codiceValuta !== "EUR")
                .map((counter) => (
                  <ChipValorizzazioneValuta
                    valorizzazione={counter.sum}
                    codiceValuta={counter.codiceValuta}
                  />
                ))}
              <ChipValorizzazioneEuro valorizzazione={totaleTotaleEuro} />
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    );

    //Questo lo lascio coosì per il momento
    /*
    const sommaValorizzazioniEuro = reclamiSelezionati
      .flatMap((x) => x[INDEX_VALORIZZAZIONE_EURO])
      .reduce((partialSum, a) => partialSum + a, 0);
    let sommaValorizzazioniValuta = 0;
    if (tuttiStessaValuta()) {
      sommaValorizzazioniValuta = reclamiSelezionati
        .flatMap((x) => x[INDEX_VALORIZZAZIONE_VALUTA])
        .reduce((partialSum, a) => partialSum + a, 0);
    }*/
  };
  return (
    <Stack
      direction={"row"}
      spacing={1}
      justifyContent="flex-start"
      alignItems="center"
      pr={2}
    >
      {displaySommaValorizzazioni()}
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
          disabled={!tuttiModificaAbilitata()}
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
      <Tooltip title="Gestisci tag">
        <IconButton
          aria-label="aggiungiTags"
          size="small"
          onClick={() => handleClickOpenTags()}
        >
          <TagIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Modifica rateo">
        <IconButton
          aria-label="modifica rateo"
          size="small"
          color="info"
          onClick={() => handleClickOpenDialogRateo()}
          disabled={!tuttiModificaAbilitata()}
        >
          R
        </IconButton>
      </Tooltip>
      <Divider orientation="vertical" flexItem />
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
      <Divider orientation="vertical" flexItem />
      <Tooltip
        title={
          tuttiModificaAbilitata()
            ? "Crea proposta TCS"
            : "Non hai i permessi per creare la proposta TCS"
        }
      >
        <span>
          <IconButton
            aria-label="crea proposta TCS"
            size="small"
            onClick={() => handleClickOpenNuovaPropostaTcs()}
            color="warning"
            disabled={!tuttiModificaAbilitata()}
          >
            <FactCheckIcon />
          </IconButton>
        </span>
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
      <DialogModificaRateo
        opened={openedDialogRateo}
        handleClose={handleClickCloseDialogRateo}
        handleOnSubmit={handleOnModificaRateo}
      />
      <DialogCreaProposta
        opened={openedDialogProposta}
        handleClose={handleClickCloseNuovaPropostaTcs}
        handleOnSubmit={onSubmitProposta}
        idReclamoList={getIdReclamoList(reclamiSelezionati)}
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
