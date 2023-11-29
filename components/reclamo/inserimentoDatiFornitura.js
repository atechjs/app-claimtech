import { Paper, Stack, TextField, Typography } from "@mui/material";
import React, { useEffect } from "react";
import ModificaDatiFornitura from "./datiFornitura/modificaDatiFornitura";
import useFormById from "../fetching/useFormById";
import { getPartitaList } from "../../utils/partitaUtils";
export default function InserimentoDatiFornitura({
  dataReclamo,
  onDatiFornituraInseriti,
}) {
  const textFieldReadOnly = (label, value) => {
    return (
      <TextField
        label={label}
        defaultValue={value}
        size="small"
        InputProps={{
          readOnly: true,
        }}
      />
    );
  };

  const {
    trigger,
    data: formData,
    isMutating,
  } = useFormById(dataReclamo.idForm);

  useEffect(() => {
    trigger({ id: dataReclamo.idForm });
  }, [dataReclamo.idForm]);

  return (
    <Stack direction={"column"} spacing={1}>
      <Paper>
        <Stack direction={"column"} spacing={1} p={1}>
          <Typography>Parametri</Typography>
          <Stack direction={"row"} spacing={1}>
            {textFieldReadOnly("FORM", dataReclamo.codiceForm)}
            {textFieldReadOnly("VALUTA", dataReclamo.codiceValuta)}
            {textFieldReadOnly(
              "COSTO CARTA E ADESIVO",
              dataReclamo.costoCartaAdesivo
            )}
            {textFieldReadOnly(
              "COSTO RIBOBINATRICE",
              dataReclamo.costoRibobinatrice
            )}
            {textFieldReadOnly(
              "COSTO FERMO MACCHINA",
              dataReclamo.costoFermoMacchina
            )}
          </Stack>
        </Stack>
      </Paper>
      <Paper>
        {formData ? (
          <ModificaDatiFornitura
            idForm={dataReclamo.idForm}
            codiceValuta={dataReclamo.codiceValuta}
            costoCartaAdesivo={dataReclamo.costoCartaAdesivo}
            costoRibobinatrice={dataReclamo.costoRibobinatrice}
            costoFermoMacchina={dataReclamo.costoFermoMacchina}
            partitaList={getPartitaList(
              formData.campoList,
              dataReclamo.partitaList
            )}
            columnsData={formData.campoList}
            exprValuta={formData.exprValuta}
            onSubmit={onDatiFornituraInseriti}
            abilitaModifica={true}
          />
        ) : (
          <></>
        )}
      </Paper>
    </Stack>
  );
}
