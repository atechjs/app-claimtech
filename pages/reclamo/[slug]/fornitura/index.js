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
import usePermessiReclamoUtente from "../../../../components/fetching/usePermessiReclamoUtente";
import DialogCondivisioneUtenti from "../../../../components/condivisioneUtente/dialogCondivisioneUtenti";

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

  useEffect(() => {
    mutatePermessi();
  }, []);
  const onPermessiCaricati = (data) => {
    setPermessiReclamoUtente(data);
  };
  const { mutate: mutatePermessi } = usePermessiReclamoUtente(
    router.query.slug,
    onPermessiCaricati
  );
  const [permessiReclamoUtente, setPermessiReclamoUtente] = useState(undefined);

  if (data === undefined || !permessiReclamoUtente) return <CircularProgress />;

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
        abilitaModifica={permessiReclamoUtente.modifica}
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
