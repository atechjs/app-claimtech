import useSWR from "swr";

import getApiUrl from "../../utils/BeUrl";
import GetCurrentAxiosInstance from "../../utils/Axios";

export default function useProposteAssegnate(fetch, query, onDataSuccess) {
  const instance = GetCurrentAxiosInstance();
  const fetcherReclami = (url, idFiltroSelezionato) =>
    instance
      .get(url, {
        params: {
          idFiltroSelezionato: idFiltroSelezionato,
        },
      })
      .then((res) => res.data);
  const { data, mutate, isLoading, error } = useSWR(
    fetch
      ? [
          getApiUrl() + "api/proposta/proposteAssegnate",
          query["idFiltroSelezionato"] ? query["idFiltroSelezionato"] : 1,
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
        proposteList: data.proposteList,
        mutate,
        isLoading,
        error,
      }
    : { idFiltroSelezionato: 1, filtriList: [], proposteList: [] };
}
