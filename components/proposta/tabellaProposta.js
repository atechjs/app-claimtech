import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Collapse from "@mui/material/Collapse";
import Select from "react-select";
import dayjs from "dayjs";
import {
  Badge,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
export default function TabellaProposta({
  propostaFornituraCausaReclamoList,
  workflowGestioneReclamoList,
  sottoTabella,
  modificaAbilitata,
  onOpenClick,
  onAccettaClick,
  onModificaClick,
  onWorkflowSelected,
  onNotaChanged,
  codiceValuta,
  onButtonInfoStatoClick,
  soloVisualizzazione,
}) {
  const creaStatoNote = (noteOrig, statoList) => {
    if (!statoList || statoList.length === 0) return noteOrig;
    const ultimoStato = statoList[0];
    if (ultimoStato.note === null || ultimoStato.note === "") return noteOrig;
    return ultimoStato.note;
  };
  const creaStatoTipologia = (index, statoList) => {
    if (!statoList || statoList.length === 0) return "-";
    const ultimoStato = statoList[0];
    return (
      <Stack direction={"row"} justifyContent="flex-start" alignItems="center">
        <Tooltip title="Apri storico proposta">
          <IconButton
            color="info"
            onClick={() => onButtonInfoStatoClick(statoList)}
          >
            <InfoIcon />
          </IconButton>
        </Tooltip>
        <span>{ultimoStato.codiceTipologiaStato}</span>
      </Stack>
    );
  };

  const creaStatoData = (statoList) => {
    if (!statoList || statoList.length === 0) return "-";
    const ultimoStato = statoList[0];
    return dayjs(ultimoStato.timestamp).format("DD/MM/YYYY");
  };

  const creaStatoUtente = (statoList) => {
    if (!statoList || statoList.length === 0) return "-";
    const ultimoStato = statoList[0];
    return ultimoStato.usernameUtente;
  };
  const selectStyles = {
    menu: (base) => ({
      ...base,
      zIndex: 100,
    }),
  };
  const creaRiga = (propostaFornituraCausaReclamo, index) => {
    return (
      <>
        <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
          {!sottoTabella ? (
            <TableCell>
              <Badge
                badgeContent={
                  propostaFornituraCausaReclamo.precedenteList.length
                }
                color="primary"
              >
                <IconButton
                  aria-label="expand row"
                  size="small"
                  onClick={() => onOpenClick(index)}
                >
                  {propostaFornituraCausaReclamo.open ? (
                    <KeyboardArrowUpIcon />
                  ) : (
                    <KeyboardArrowDownIcon />
                  )}
                </IconButton>
              </Badge>
            </TableCell>
          ) : null}
          <TableCell>{propostaFornituraCausaReclamo.codiceFornitura}</TableCell>
          <TableCell>
            {propostaFornituraCausaReclamo.codiceCausaReclamo}
          </TableCell>
          <TableCell>
            {propostaFornituraCausaReclamo.valoreContestazione}
          </TableCell>
          <TableCell>
            <b>{propostaFornituraCausaReclamo.codiceWorkflowGestioneReclamo}</b>
          </TableCell>
          <TableCell>
            <b>
              {creaStatoNote(
                propostaFornituraCausaReclamo.note,
                propostaFornituraCausaReclamo.statoList
              )}
            </b>
          </TableCell>
          <TableCell>
            {creaStatoTipologia(index, propostaFornituraCausaReclamo.statoList)}
          </TableCell>
          <TableCell>
            {creaStatoData(propostaFornituraCausaReclamo.statoList)}
          </TableCell>
          <TableCell>
            {creaStatoUtente(propostaFornituraCausaReclamo.statoList)}
          </TableCell>
          {!sottoTabella && !soloVisualizzazione ? (
            <TableCell>
              <Stack direction={"column"}>
                <RadioGroup
                  defaultValue={undefined}
                  name="sceltaProposta"
                  value={
                    propostaFornituraCausaReclamo.azione
                      ? propostaFornituraCausaReclamo.azione
                      : null
                  }
                >
                  <Stack direction={"row"}>
                    <FormControlLabel
                      value="ACCETTA"
                      control={<Radio color="success" />}
                      label="Accetta"
                      onChange={() => onAccettaClick(index)}
                      disabled={!modificaAbilitata}
                    />
                    <FormControlLabel
                      value="MODIFICA"
                      control={<Radio color="warning" />}
                      label="Modifica"
                      onChange={() => onModificaClick(index)}
                      disabled={!modificaAbilitata}
                    />
                  </Stack>
                </RadioGroup>
                <Stack direction={"column"} spacing={1}>
                  {propostaFornituraCausaReclamo.azione === "MODIFICA" ? (
                    workflowGestioneReclamoList ? (
                      <Box minWidth={"220"}>
                        <Typography>Alternativa</Typography>
                        <Select
                          options={workflowGestioneReclamoList.filter(
                            (x) =>
                              x.value !==
                              propostaFornituraCausaReclamo.idWorkflowGestioneReclamo
                          )}
                          onChange={(e) => {
                            const newValue = !e || e == null ? null : e.value;
                            onWorkflowSelected(index, newValue);
                          }}
                          autosize={true}
                          value={workflowGestioneReclamoList.find(
                            (x) =>
                              x.value ===
                              propostaFornituraCausaReclamo.idWorkflowCausaReclamoAlternativo
                          )}
                          menuPortalTarget={document.body}
                          styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                          }}
                          menuPosition={"fixed"}
                        />
                      </Box>
                    ) : null
                  ) : null}
                  {propostaFornituraCausaReclamo.azione &&
                  propostaFornituraCausaReclamo.azione !== null ? (
                    <TextField
                      id="notePropostaFornituraCausaReclamo"
                      sx={{ minWidth: 400 }}
                      label="Note aggiuntive"
                      multiline
                      maxRows={4}
                      onChange={(e) => {
                        const value = e.target.value;
                        onNotaChanged(index, value);
                      }}
                    />
                  ) : null}
                </Stack>
              </Stack>
            </TableCell>
          ) : null}
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
            <Collapse
              in={propostaFornituraCausaReclamo.open}
              timeout="auto"
              unmountOnExit
            >
              <Typography variant="body1">Proposte precedenti</Typography>
              <TabellaProposta
                propostaFornituraCausaReclamoList={
                  propostaFornituraCausaReclamo.precedenteList
                }
                onButtonInfoStatoClick={onButtonInfoStatoClick}
                sottoTabella={true}
                codiceValuta={codiceValuta}
                soloVisualizzazione={soloVisualizzazione}
              />
            </Collapse>
          </TableCell>
        </TableRow>
      </>
    );
  };

  return propostaFornituraCausaReclamoList.length > 0 ? (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {!sottoTabella ? <TableCell /> : null}
            <TableCell>Codice partita</TableCell>
            <TableCell>Causa</TableCell>
            <TableCell>
              Valore contestazione {" (" + codiceValuta + ")"}
            </TableCell>
            <TableCell>Gestione richiesta</TableCell>
            <TableCell>Note</TableCell>
            <TableCell>Stato</TableCell>
            <TableCell>Data</TableCell>
            <TableCell>Utente</TableCell>
            {!sottoTabella && !soloVisualizzazione ? (
              <TableCell>Azione</TableCell>
            ) : null}
          </TableRow>
        </TableHead>
        <TableBody>
          {propostaFornituraCausaReclamoList.map((riga, index) =>
            creaRiga(riga, index)
          )}
        </TableBody>
      </Table>
    </TableContainer>
  ) : (
    <></>
  );
}
