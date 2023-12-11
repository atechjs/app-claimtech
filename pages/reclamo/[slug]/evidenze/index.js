import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Divider,
  FormControlLabel,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import GetCurrentAxiosInstance from "../../../../utils/Axios";
import ReclamoNestedLayout from "../../../../components/reclamo/reclamoNestedLayout";
import useReclamoEvidenze from "../../../../components/fetching/useReclamoEvidenze";
import usePermessiReclamoUtente from "../../../../components/fetching/usePermessiReclamoUtente";
import ModificaEvidenze from "../../../../components/evidenze/modificaEvidenze/modificaEvidenze";
import { mandaNotifica } from "../../../../utils/ToastUtils";
import useReclamoFornitura from "../../../../components/fetching/useReclamoFornitura";

export default function Page() {
  const router = useRouter();
  const { isReady } = router;
  const instance = GetCurrentAxiosInstance();
  const { data, trigger, isMutating } = useReclamoEvidenze(undefined);
  const [dataList, setDataList] = useState([]);
  const {
    data: fornituraList,
    trigger: fornituraTrigger,
    isMutating: isFornituraMutating,
  } = useReclamoFornitura(undefined);

  useEffect(() => {
    if (data !== undefined) setDataList(data);
  }, [data]);

  useEffect(() => {
    if (!isReady) return;
    trigger({ id: router.query.slug });
    fornituraTrigger({ id: router.query.slug });
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

  const ricaricaEvidenze = () => {
    trigger({ id: router.query.slug });
  };

  if (
    data === undefined ||
    !permessiReclamoUtente ||
    fornituraList === undefined
  )
    return <CircularProgress />;
  return (
    <Stack direction={"column"} spacing={1}>
      <ModificaEvidenze
        evidenzaList={dataList}
        fornituraList={fornituraList}
        abilitaModifica={permessiReclamoUtente.modifica}
        onSalva={ricaricaEvidenze}
      />
    </Stack>
  );
}

Page.getLayout = function getLayout(page) {
  return <ReclamoNestedLayout>{page}</ReclamoNestedLayout>;
};
