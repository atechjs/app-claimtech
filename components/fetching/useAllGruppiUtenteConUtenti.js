import useSWR from "swr";
import { getAxiosFetcher } from "../../utils/AxiosFetcher";
import getApiUrl from "../../utils/BeUrl";

export default function useAllGruppiUtenteConUtenti() {
  const fetcher = getAxiosFetcher;
  const { data, error, isLoading } = useSWR(
    getApiUrl() + "api/gruppoUtente/gruppiConUtenti",
    fetcher
  );
  return {
    gruppoUtenteList: data,
    isLoading,
    isError: error,
  };
}
