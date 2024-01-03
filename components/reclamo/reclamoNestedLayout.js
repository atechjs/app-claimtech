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
import usePermessiReclamoUtente from "../fetching/usePermessiReclamoUtente";
import axios from "axios";

export default function ReclamoNestedLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isReady } = router;
  const [token, setToken] = useState(undefined);
  const [permessiReclamoUtente, setPermessiReclamoUtente] = useState(undefined);
  useEffect(() => {
    setToken(authServ.getCurrentJwtToken());
  }, []);
  useEffect(() => {
    if (!router.query.slug || !token) return;
    const instance = axios.create();
    instance.defaults.headers.common["Authorization"] = "Bearer " + token;
    instance.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
    instance
      .get(
        getApiUrl() +
          "api/reclamo/permessiReclamoUtente?id=" +
          router.query.slug
      )
      .then((response) => {
        setPermessiReclamoUtente(response.data);
      });
  }, [router.query.slug, token]);
  const onErrorCall = () => {
    mandaNotifica("Impossibile caricare il reclamo", "error");
  };

  const { data, mutate, isMutating, error } = useReclamoDatiGeneraliById(
    router.query.slug,
    token,
    onErrorCall
  );

  if (data === undefined || isMutating || !permessiReclamoUtente)
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
    return arr.at(arr.indexOf("reclamo") + 2);
  }

  return (
    <Layout>
      <ReclamoAppBar
        data={data}
        onSync={onSync}
        permessiReclamoUtente={permessiReclamoUtente}
      />
      <Stack direction={"column"}>
        <ReclamoTabSelector
          id={data.id}
          value={getSelectedTab()}
          permessiReclamoUtente={permessiReclamoUtente}
        />
        {children}
      </Stack>
    </Layout>
  );
}
