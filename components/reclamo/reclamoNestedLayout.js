import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { usePathname } from "next/navigation";
import useReclamoDatiGeneraliById from "../fetching/useReclamoDatiGeneraliById";
import { LinearProgress, Stack } from "@mui/material";
import Layout from "../layout";
import ReclamoAppBar from "./reclamoAppBar";
import authServ from "../../services/auth.service";
import getApiUrl from "../../utils/BeUrl";
import ReclamoTabSelector from "./reclamoTabSelector";
import { mandaNotifica } from "../../utils/ToastUtils";

export default function ReclamoNestedLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isReady } = router;
  const [token, setToken] = useState(undefined);
  useEffect(() => {
    setToken(authServ.getCurrentJwtToken());
  }, []);

  const onErrorCall = () => {
    mandaNotifica("Impossibile caricare il reclamo", "error");
  };

  const { data, mutate, isMutating, error } = useReclamoDatiGeneraliById(
    router.query.slug,
    token,
    onErrorCall
  );

  if (data === undefined || isMutating)
    return (
      <Layout>
        <ReclamoAppBar data={undefined}></ReclamoAppBar>
        <LinearProgress />
      </Layout>
    );

  const onSync = () => {
    mutate();
  };

  function vhToPixels(vh) {
    return Math.round(window.innerHeight / (100 / vh));
  }

  function getSelectedTab() {
    const arr = pathname.split("/");
    return arr.at(arr.length - 1);
  }

  return (
    <Layout>
      <ReclamoAppBar data={data} onSync={onSync} />
      <Stack direction={"column"}>
        <ReclamoTabSelector id={data.id} value={getSelectedTab()} />
        {children}
      </Stack>
    </Layout>
  );
}
