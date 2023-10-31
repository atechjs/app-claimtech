import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import ReclamoNestedLayout from "../../../../components/reclamo/reclamoNestedLayout";
import useReclamoFornitura from "../../../../components/fetching/useReclamoFornitura";
import ModificaDatiFornitura from "../../../../components/reclamo/datiFornitura/modificaDatiFornitura";
import GetCurrentAxiosInstance from "../../../../utils/Axios";
import getApiUrl from "../../../../utils/BeUrl";
import { mandaNotifica } from "../../../../utils/ToastUtils";
import DialogCondivisioneUtenti from "../../../../components/condivisioneUtente/DialogCondivisioneUtenti";

export default function Page() {
  const router = useRouter();
  const { isReady } = router;
  const instance = GetCurrentAxiosInstance();

  const { data, trigger, isMutating } = useReclamoFornitura(undefined);
  const [openedDialogCondivisione, setOpenedDialogCondivisione] =
    useState(false);

  useEffect(() => {
    if (!isReady) return;
    trigger({ id: router.query.slug });
  }, [isReady]);

  if (data === undefined) return <CircularProgress />;

  const onDatiFornituraInseriti = (dataAggiornata, responseData) => {
    if (responseData.richiedeCondivisione) {
      handleClickOpenDialogCondivisione();
    }
  };

  const handleClickOpenDialogCondivisione = () => {
    setOpenedDialogCondivisione(true);
  };

  const handleCloseDialogCondivisione = () => {
    setOpenedDialogCondivisione(false);
  };

  const handleOnCondividiSubmit = (list) => {
    const idUtenteList = list.map((utente) => utente.id);
    instance
      .post(getApiUrl() + "api/reclamo/condividi", {
        idReclamoList: [data.id],
        idUtenteList: idUtenteList,
      })
      .then(() => {
        mandaNotifica("Reclamo condiviso correttamente", "success");
        handleCloseDialogCondivisione();
      })
      .catch(() =>
        mandaNotifica("Impossibile condividere il reclamo", "error")
      );
  };

  return (
    <Stack direction={"column"} spacing={1}>
      <ModificaDatiFornitura
        idReclamo={data.id}
        idForm={data.idForm}
        codiceValuta={data.codiceValuta}
        costoCartaAdesivo={data.costoCartaAdesivo}
        costoRibobinatrice={data.costoRibobinatrice}
        costoFermoMacchina={data.costoFermoMacchina}
        partitaList={data.partitaList}
        columnsData={data.columnData}
        exprValuta={data.exprValuta}
        onSubmit={onDatiFornituraInseriti}
        modificaLista={true}
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
  return <ReclamoNestedLayout>{page}</ReclamoNestedLayout>;
};
