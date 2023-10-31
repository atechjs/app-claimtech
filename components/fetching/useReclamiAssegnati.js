import useSWR from "swr";

import getApiUrl from "../../utils/BeUrl";
import GetCurrentAxiosInstance from "../../utils/Axios";

export default function useReclamiAssegnati(fetch, query, onDataSuccess) {
  const instance = GetCurrentAxiosInstance();
  const fetcherReclami = (url, idFiltroSelezionato, esercizio) =>
    instance
      .get(url, {
        params: {
          idFiltroSelezionato: idFiltroSelezionato,
          esercizio: esercizio,
        },
      })
      .then((res) => res.data);
  const { data, mutate, isLoading, error } = useSWR(
    fetch
      ? [
          getApiUrl() + "api/reclamo/reclamiAssegnati",
          query["idFiltroSelezionato"] ? query["idFiltroSelezionato"] : null,
          query["esercizio"] ? query["esercizio"] : null,
        ]
      : null,
    ([url, idFiltroSelezionato, esercizio]) =>
      fetcherReclami(url, idFiltroSelezionato, esercizio),
    {
      onSuccess: (data, key, config) => {
        onDataSuccess(data);
      },
    }
  );

  return data !== undefined
    ? {
        idFiltroSelezionato: data.idFiltroSelezionato,
        filtriList: data.filtriList,
        reclamiList: data.reclamiList,
        mutate,
        isLoading,
        error,
      }
    : { idFiltroSelezionato: -1, filtriList: [], reclamiList: [] };
}
