import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import {
  Button,
  Chip,
  Divider,
  Stack,
  Tooltip,
  createTheme,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/router";
import { ThemeProvider } from "@mui/material";
import StatoReclamo from "../statoReclamo";
import TagIcon from "@mui/icons-material/Tag";
import Tag from "../tag";
import ValueWithIcon from "../my-mui-data-table/valueWithIcon";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PersonIcon from "@mui/icons-material/Person";
import ShareIcon from "@mui/icons-material/Share";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DialogAssegnaTag from "../assegnaTag/dialogAssegnaTag";
import AddIcon from "@mui/icons-material/Add";
import GetCurrentAxiosInstance from "../../utils/Axios";
import getApiUrl from "../../utils/BeUrl";
import { mandaNotifica } from "../../utils/ToastUtils";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import FactoryIcon from "@mui/icons-material/Factory";
import useFaseSelettore from "../fetching/useFaseSelettore";
import Select from "react-select";
import { formattaOdl } from "../../utils/OdlUtils";
import { getCodiciArticoloUnivoci } from "../../utils/articoloUtils";
import { getCodiciLineaUnivoci } from "../../utils/lineaUtils";
import DialogDownloadReportReclami from "../downloadReportReclami/dialogDownloadReportReclami";
import DialogCondivisioneUtenti from "../condivisioneUtente/dialogCondivisioneUtenti";

export default function ReclamoAppBar({ data, onSync, permessiReclamoUtente }) {
  if (data === undefined) return;
  const router = useRouter();
  const instance = GetCurrentAxiosInstance();
  const getMuiTheme = () =>
    createTheme({
      palette: {
        primary: {
          main: "#FFFFFF",
        },
      },
      components: {
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
        MuiTextField: {
          defaultProps: {
            autoComplete: "off",
          },
        },
      },
    });
  const getDefault = () =>
    createTheme({
      palette: {
        primary: {
          main: "#1976d2",
        },
      },
    });
  const [openedDialogCondivisione, setOpenedDialogCondivisione] =
    useState(false);

  const [openedDialogTags, setOpenedDialogTags] = useState(false);

  const [
    openedDialogDownloadReportReclami,
    setOpenedDialogDownloadReportReclami,
  ] = useState(false);

  const { fasiList, isValidating, mutate } = useFaseSelettore(data.idFase);

  const handleClickOpen = () => {
    setOpenedDialogCondivisione(true);
  };

  const handleClose = () => {
    setOpenedDialogCondivisione(false);
  };

  const handleClickOpenTags = () => {
    setOpenedDialogTags(true);
  };

  const handleCloseOpenTags = () => {
    setOpenedDialogTags(false);
  };

  const handleClickOpenReportReclami = () => {
    setOpenedDialogDownloadReportReclami(true);
  };

  const handleCloseReportReclami = () => {
    setOpenedDialogDownloadReportReclami(false);
  };

  const onUpdateReclamiHere = (newValue) => {
    instance
      .post(getApiUrl() + "api/reclamo/cambiaFase", {
        idFase: newValue.value,
        idReclamiList: [data.id],
      })
      .then((response) => {
        mandaNotifica("Reclamo aggiornato con successo", "success");
        if (response.data === true) handleClickOpen();
        onSync();
      })
      .catch(() =>
        mandaNotifica("Impossibile aggiornare la fase del reclamo", "error")
      );
  };

  const handleOnCondividiSubmit = (obj) => {
    const inviaMail = obj.inviaMail;
    const list = obj.list;
    const idUtenteList = list.map((utente) => utente.id);
    instance
      .post(getApiUrl() + "api/reclamo/condividi", {
        idReclamoList: [data.id],
        idUtenteList: idUtenteList,
        inviaMail: inviaMail,
      })
      .then(() => {
        mandaNotifica("Reclamo condiviso correttamente", "success");
        handleClose();
      })
      .catch(() =>
        mandaNotifica("Impossibile condividere il reclamo", "error")
      );
  };

  const handleOnTagsSubmit = (list) => {
    instance
      .post(getApiUrl() + "api/reclamo/associaTag", {
        idReclamoList: [data.id],
        tags: list.tags,
        assegna: list.assegna,
      })
      .then(() => {
        mandaNotifica(
          list.assegna
            ? "Tags associati correttamente"
            : "Tags rimossi correttamente",
          "success"
        );
        handleCloseOpenTags();
        onSync();
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

  if (data === undefined)
    return (
      <ThemeProvider theme={getMuiTheme}>
        <AppBar position="static" sx={{ maxWidth: "100%" }}>
          <Toolbar>
            <Typography>Caricamento reclamo...</Typography>
          </Toolbar>
        </AppBar>
      </ThemeProvider>
    );
  return (
    <>
      <ThemeProvider theme={getMuiTheme}>
        <AppBar position="static" sx={{ maxWidth: "100%", pt: 0.5, pb: 0.5 }}>
          <Toolbar sx={{ paddingLeft: 0, paddingRight: 0 }}>
            <Stack
              direction={"row"}
              justifyContent="flex-start"
              alignItems="center"
              spacing={1}
            >
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="open drawer"
                sx={{ mr: 2 }}
                onClick={() => router.back()}
              >
                <ArrowBackIcon />
              </IconButton>
              <Stack direction={"column"}>
                <Stack
                  direction={"row"}
                  spacing={1}
                  justifyContent="flex-start"
                  alignItems="center"
                >
                  <StatoReclamo
                    aperto={!data.chiuso}
                    codiceTipologiaReclamo={data.codiceTipologiaReclamo}
                  />
                  <Typography variant="body1" align="left">
                    <b>{data.numero}</b>
                  </Typography>
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
                    {data.codiceReclamoCliente}
                  </Typography>
                </Stack>
                {
                  <Stack direction={"row"} spacing={0.5}>
                    {data.tagList.map((tag) => (
                      <Tag label={tag.descrizione} colore={tag.colore} />
                    ))}
                  </Stack>
                }
              </Stack>
              <Divider orientation="vertical" flexItem />
              <Stack direction={"column"}>
                <ValueWithIcon
                  value={data.codiceCliente + " - " + data.descrizioneCliente}
                  icon={<PersonIcon fontSize="small" />}
                />
                {getCodiciArticoloUnivoci(data.codiceArticoloList).map((x) => (
                  <ValueWithIcon
                    value={x}
                    icon={<LocalOfferIcon fontSize="small" />}
                  />
                ))}
                {getCodiciLineaUnivoci(data.codiceLineaList).map((x) => (
                  <ValueWithIcon
                    value={x}
                    icon={<PrecisionManufacturingIcon fontSize="small" />}
                  />
                ))}
              </Stack>
              <Divider orientation="vertical" flexItem />
              <ValueWithIcon
                value={
                  data.codiceStabilimento + " - " + data.descrizioneStabilimento
                }
                icon={<FactoryIcon fontSize="small" />}
              />
              <Divider orientation="vertical" flexItem />
              <Stack direction={"column"}>
                {fasiList ? (
                  <Select
                    options={fasiList}
                    value={fasiList.find((x) => x.value === data.idFase)}
                    onChange={(newValue) => onUpdateReclamiHere(newValue)}
                    isDisabled={!permessiReclamoUtente.modifica}
                  />
                ) : (
                  <></>
                )}
                <Stack direction={"row"} spacing={0.5}>
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
                        handleClickOpenReportReclami();
                      }}
                    >
                      <PictureAsPdfIcon />
                    </IconButton>
                  </Tooltip>
                  <Stack direction={"row"} spacing={0.5}>
                    <Tooltip title="Nuovo reclamo">
                      <IconButton
                        aria-label="nuovo reclamo"
                        size="small"
                        onClick={() => {
                          router.push("/reclamo/nuovo");
                        }}
                      >
                        <AddIcon />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
          </Toolbar>
        </AppBar>
      </ThemeProvider>
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
      <DialogDownloadReportReclami
        opened={openedDialogDownloadReportReclami}
        handleClose={handleCloseReportReclami}
        idReclamoList={[router.query.slug]}
      />
    </>
  );
}
