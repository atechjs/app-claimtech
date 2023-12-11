import React, { useEffect, useState } from "react";
import { Stack, Paper, Typography, Button } from "@mui/material";
import useCategoriaEvidenzaSelect from "../fetching/useCategoriaEvidenzaSelect";
import useTipologiaStatoEvidenzaSelect from "../fetching/useTipologiaStatoEvidenzaSelect";
import useSWR from "swr";
import getApiUrl from "../../utils/BeUrl";
import { getAxiosFetcher } from "../../utils/AxiosFetcher";
import dayjs from "dayjs";
import { GetCurrentUser } from "../../utils/Axios";
import ModificaEvidenze from "../evidenze/modificaEvidenze/modificaEvidenze";
export default function InserimentoDatiEvidenze({
  dataReclamo,
  onDatiEvidenzeInseriti,
}) {
  const { data: categoriaList, mutate: categoriaMutate } =
    useCategoriaEvidenzaSelect();

  useEffect(() => {
    categoriaMutate();
  }, []);
  const { data: tipologiaStatoEvidenzaList } = useSWR(
    categoriaList && categoriaList.length > 0
      ? getApiUrl() + "api/evidenza/tipologiaStatoEvidenzaSelect"
      : null,
    getAxiosFetcher,
    {
      onSuccess: (values) => {
        const resultList = dataReclamo.partitaList.flatMap((p) =>
          p.causaList.flatMap((fornituraCausaReclamo) => {
            return categoriaList.map((categoria) => ({
              id: null,
              idFornituraCausaReclamo: null,
              codiceFornitura: p.codice,
              codiceCausaReclamo: fornituraCausaReclamo.codiceCausa,
              idCategoria: categoria.value,
              codiceCategoria: categoria.label,
              idStato: values[0].value,
              codiceStato: values[0].label,
              timestampStato: dayjs(),
              usernameStato: GetCurrentUser().username,
              note: null,
              allegatoList: [],
              oldIndex: fornituraCausaReclamo.index,
            }));
          })
        );
        setList(resultList);
      },
    }
  );

  const [list, setList] = useState(undefined);

  const onSalva = (values) => {
    const evidenzaList = values.filter(
      (v) => v.idStato !== tipologiaStatoEvidenzaList[0].value
    );
    const fileEvidenze = evidenzaList.flatMap((ev) =>
      ev.allegatoList.map((al) => al.file)
    );
    const result = dataReclamo.partitaList.flatMap((partita) => ({
      ...partita,
      causaList: partita.causaList.map((fornituraCausaReclamo) => ({
        ...fornituraCausaReclamo,
        evidenzaList: evidenzaList.filter(
          (ev) => ev.oldIndex === fornituraCausaReclamo.index
        ),
      })),
    }));
    onDatiEvidenzeInseriti({ partitaList: result }, fileEvidenze);
  };

  return (
    <Stack direction={"column"} spacing={1}>
      {list !== undefined ? (
        <ModificaEvidenze
          evidenzaList={list}
          onSalva={onSalva}
          isSalva
          abilitaModifica
        />
      ) : null}
    </Stack>
  );
}
