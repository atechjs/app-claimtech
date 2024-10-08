import React, { useEffect, useState } from "react";
import NestedLayout from "../../components/nestedLayout";
import Layout from "../../components/layout";
import {
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import GetCurrentAxiosInstance from "../../utils/Axios";
import getApiUrl from "../../utils/BeUrl";
import { mandaNotifica } from "../../utils/ToastUtils";
import useClienteById from "../../components/fetching/useClienteById";
import MyReactSelect from "../../components/my-react-select-impl/myReactSelect";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import AggiungiDatiAggiuntiviCliente from "../../components/cliente/aggiungiDatiAggiuntiviCliente";
import AggiungiClienteForm from "../../components/cliente/aggiungiClienteForm";
import useUtentiSelect from "../../components/fetching/useUtentiSelect";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import MyDropzone from "../../components/dropzone/myDropzone";
import dayjs from "dayjs";
import axios from "axios";

export default function Page() {
  const router = useRouter();
  const [id, setId] = useState(undefined);
  const instance = GetCurrentAxiosInstance();
  const { utentiList } = useUtentiSelect();
  const [testList, setTestList] = useState([]);
  useEffect(() => {
    if (router.query.slug === undefined) return;
    setId(router.query.slug);
  }, [router.query.slug]);

  useEffect(() => {
    if (id === undefined || id === "nuovo") return;
    trigger({ id: id });
  }, [id]);

  const { data, trigger, isMutating } = useClienteById(id);

  useEffect(() => {
    if (data === undefined) return;
    reset({
      id: data.id,
      codice: data.codice,
      descrizione: data.descrizione,
      costoCartaAdesivo: data.costoCartaAdesivo,
      costoRibobinatrice: data.costoRibobinatrice,
      costoFermoMacchina: data.costoFermoMacchina,
      formClienteList: data.formClienteList,
      datiAggiuntiviList: data.datiAggiuntiviList,
      idUtenteList: data.idUtenteList,
      scpList: data.scpList,
      scpFileList: [],
    });
  }, [data]);

  const form = useForm({
    defaultValues: {
      id: null,
      codice: null,
      descrizione: null,
      costoCartaAdesivo: 0.35,
      costoRibobinatrice: 0,
      costoFermoMacchina: 0,
      formClienteList: [],
      datiAggiuntiviList: [],
      idUtenteList: [],
      scpList: [],
      scpFileList: [],
    },
  });
  const {
    register,
    handleSubmit,
    formState,
    reset,
    control,
    getValues,
    setValue,
    watch,
  } = form;
  const { errors } = formState;

  const onSubmit = (data) => {
    const formData = new FormData();
    data.scpFileList.forEach((file) => {
      formData.append("files", file);
    });
    formData.append(
      "request",
      new Blob([JSON.stringify(data)], {
        type: "application/json",
      })
    );
    if (data.id === undefined || data.id === "nuovo" || data.id === null) {
      instance
        .post(getApiUrl() + "api/cliente/nuovo", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((response) => {
          setId(response.data);
          mandaNotifica("Creazione completata con successo", "success");
        })
        .catch(() => mandaNotifica("Creazione fallita", "error"));
    } else {
      instance
        .post(getApiUrl() + "api/cliente/update", formData)
        .then(() => {
          mandaNotifica("Aggiornamento completato con successo", "success");
        })
        .catch(() => mandaNotifica("Impossibile aggiornare", "error"));
    }
  };
  const elimina = () => {
    instance
      .post(getApiUrl() + "api/cliente/delete?id=" + id)
      .then(() => {
        mandaNotifica("Eliminazione completata con successo", "success");
        router.back();
      })
      .catch(() =>
        mandaNotifica(
          "Impossibile cancellare, probabilmente l'elemento è utilizzato da un altra entità",
          "error"
        )
      );
  };

  const aggiungiDatoAggiuntivo = (data) => {
    const datiAggiuntiviList = getValues("datiAggiuntiviList");
    if (datiAggiuntiviList.find((x) => x.codice === data.codice) === undefined)
      setValue("datiAggiuntiviList", [...datiAggiuntiviList, data]);
  };

  const rimuoviDatoAggiuntivo = (dato) => {
    const datiAggiuntiviList = getValues("datiAggiuntiviList");
    setValue(
      "datiAggiuntiviList",
      datiAggiuntiviList.filter((x) => x.codice !== dato.codice)
    );
  };

  const aggiungiClienteForm = (data) => {
    const formClienteList = getValues("formClienteList");
    if (
      formClienteList.find(
        (x) => x.codiceStabilimento === data.codiceStabilimento
      ) === undefined
    )
      setValue("formClienteList", [...formClienteList, data]);
  };

  const rimuoviClienteForm = (dato) => {
    const formClienteList = getValues("formClienteList");
    setValue(
      "formClienteList",
      formClienteList.filter(
        (x) => x.codiceStabilimento !== dato.codiceStabilimento
      )
    );
  };

  const selectStyles = {
    menu: (base) => ({
      ...base,
      zIndex: 100,
    }),
  };

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  const onFileLoaded = (acceptedFiles) => {
    setValue(
      "scpList",
      getValues("scpList").concat({ id: null, name: acceptedFiles[0].name })
    );
    setValue("scpFileList", getValues("scpFileList").concat(acceptedFiles));
  };

  const handleDownloadScp = (scp) => {
    axios({
      url: getApiUrl() + "api/cliente/downloadFileScp?id=" + scp.id,
      method: "GET",
      responseType: "blob",
    }).then((response) => {
      const href = URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = href;
      link.setAttribute("download", scp.name);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(href);
    });
  };

  const handleDeleteScp = (scp) => {
    setValue(
      "scpList",
      getValues("scpList").filter((x) => x.name !== scp.name)
    );
    setValue(
      "scpFileList",
      getValues("scpFileList").filter((x) => x.name !== scp.name)
    );
  };

  const handleClickScp = (scp) => {
    if (scp.id === null) return;
    //TODO Download file
  };

  return (
    <Paper sx={{ m: 2, p: 2 }}>
      <Stack
        direction={"column"}
        component="form"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        spacing={1}
      >
        <Typography>Form modifica cliente</Typography>
        {!isMutating ? (
          <Stack direction={"column"} spacing={1}>
            {id !== undefined ? (
              <TextField
                {...register("codice", {
                  required: "Il codice è obbligatorio",
                })}
                size="small"
                margin="normal"
                required
                id="codice"
                label="Codice"
                defaultValue={" "}
                name="codice"
                error={!!errors.codice}
                helperText={errors.codice?.message}
                autoFocus
              />
            ) : (
              <></>
            )}
            {id !== undefined ? (
              <TextField
                {...register("descrizione")}
                size="small"
                margin="normal"
                required
                id="descrizione"
                label="Ragione sociale"
                name="descrizione"
                error={!!errors.descrizione}
                helperText={errors.descrizione?.message}
              />
            ) : (
              <></>
            )}
            {id !== undefined ? (
              <TextField
                {...register("costoCartaAdesivo")}
                size="small"
                margin="normal"
                required
                id="costoCartaAdesivo"
                label="Costo carta e adesivo"
                name="costoCartaAdesivo"
                error={!!errors.costoCartaAdesivo}
                helperText={errors.costoCartaAdesivo?.message}
                type="number"
              />
            ) : (
              <></>
            )}
            {id !== undefined ? (
              <TextField
                {...register("costoRibobinatrice")}
                size="small"
                margin="normal"
                required
                id="costoRibobinatrice"
                label="Costo ribobinatrice"
                name="costoRibobinatrice"
                error={!!errors.costoRibobinatrice}
                helperText={errors.costoRibobinatrice?.message}
                type="number"
              />
            ) : (
              <></>
            )}
            {id !== undefined ? (
              <TextField
                {...register("costoFermoMacchina")}
                size="small"
                margin="normal"
                required
                id="costoFermoMacchina"
                label="Costo fermo macchina"
                name="costoFermoMacchina"
                error={!!errors.costoFermoMacchina}
                helperText={errors.costoFermoMacchina?.message}
                type="number"
              />
            ) : (
              <></>
            )}
            {utentiList ? (
              <MyReactSelect
                control={control}
                name="idUtenteList"
                label="Commerciali associati"
                options={utentiList}
                styles={selectStyles}
                isMulti={true}
              />
            ) : (
              <></>
            )}
            <Divider />
            <Typography variant="button">Form associati</Typography>
            <AggiungiClienteForm onSubmit={aggiungiClienteForm} />
            <TableContainer>
              <Table aria-label="tabella dati aggiuntivi cliente">
                <TableHead>
                  <TableRow>
                    <TableCell>Stabilimento</TableCell>
                    <TableCell>Form</TableCell>
                    <TableCell>Azione</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {watch("formClienteList").map((dato) => (
                    <TableRow
                      key={dato.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell>{dato.codiceStabilimento}</TableCell>
                      <TableCell>{dato.codiceForm}</TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => rimuoviClienteForm(dato)}
                        >
                          Rimuovi
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Divider />
            <Typography variant="button">
              Dati aggiuntivi da sistema esterno
            </Typography>
            <AggiungiDatiAggiuntiviCliente onSubmit={aggiungiDatoAggiuntivo} />
            <TableContainer>
              <Table aria-label="tabella dati aggiuntivi cliente">
                <TableHead>
                  <TableRow>
                    <TableCell>Codice cliente</TableCell>
                    <TableCell>Ragione sociale</TableCell>
                    <TableCell>Sistema esterno</TableCell>
                    <TableCell>Azione</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {watch("datiAggiuntiviList").map((dato) => (
                    <TableRow
                      key={dato.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {dato.codice}
                      </TableCell>
                      <TableCell>{dato.ragioneSociale}</TableCell>
                      <TableCell>{dato.codiceSistemaEsterno}</TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => rimuoviDatoAggiuntivo(dato)}
                        >
                          Rimuovi
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Divider />
            <Typography variant="button">
              Lista SCP(Supplier Complaint Procedure)
            </Typography>
            <MyDropzone callback={onFileLoaded} />
            <TableContainer>
              <Table aria-label="tabella SCP">
                <TableHead>
                  <TableRow>
                    <TableCell>Id</TableCell>
                    <TableCell>File</TableCell>
                    <TableCell>Data creazione</TableCell>
                    <TableCell>Utente creazione</TableCell>
                    <TableCell>Scarica</TableCell>
                    <TableCell>Rimuovi</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {watch("scpList").map((scp) => (
                    <TableRow>
                      <TableCell>{scp.id !== null ? scp.id : "-"}</TableCell>
                      <TableCell>{scp.name}</TableCell>
                      <TableCell>
                        {dayjs(scp.timestampCreazione).format("DD/MM/YYYY")}
                      </TableCell>
                      <TableCell>{scp.username}</TableCell>
                      <TableCell>
                        {scp.id !== null ? (
                          <Button onClick={() => handleDownloadScp(scp)}>
                            Download
                          </Button>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          onClick={() => handleDeleteScp(scp)}
                          color="error"
                          variant="outlined"
                        >
                          Rimuovi
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Stack>
        ) : (
          <></>
        )}
        <Stack direction={"row"} spacing={1} mt={2}>
          <Button
            variant="outlined"
            color="error"
            onClick={() => elimina()}
            disabled={id === null || id === undefined || id === "nuovo"}
          >
            Elimina
          </Button>
          <Button variant="contained" type="submit">
            Salva
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}

Page.getLayout = function getLayout(page) {
  return (
    <Layout>
      <NestedLayout title={"CLIENTE"}>{page}</NestedLayout>
    </Layout>
  );
};
