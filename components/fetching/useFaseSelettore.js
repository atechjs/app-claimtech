import useSWR from "swr";
import getApiUrl from "../../utils/BeUrl";
import GetCurrentAxiosInstance from "../../utils/Axios";

export default function useFaseSelettore(idFase) {
  const instance = GetCurrentAxiosInstance();
  const fetcher = (url, idFase) =>
    instance
      .get(url, {
        params: {
          idFase: idFase,
        },
      })
      .then((res) => res.data);
  const { data, error, isLoading, mutate, isValidating } = useSWR(
    idFase !== null ? [getApiUrl() + "api/fase/fasiCompatibili", idFase] : null,
    ([url, idFase]) => fetcher(url, idFase)
  );
  return {
    fasiList: data,
    isLoading,
    isValidating,
    isError: error,
    mutate,
    isValidating,
  };
}
