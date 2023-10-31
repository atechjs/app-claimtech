import useSWR from "swr";
import { getAxiosFetcher } from "../../utils/AxiosFetcher";
import getApiUrl from "../../utils/BeUrl";

export default function useAllGruppiUtente() {
  const fetcher = getAxiosFetcher;
  const { data, error, isLoading } = useSWR(
    getApiUrl() + "api/gruppoUtente/all",
    fetcher
  );
  return {
    gruppoUtenteList: data,
    isLoading,
    isError: error,
  };
}
