import useSWR from "swr";
import { getAxiosFetcher } from "../../utils/AxiosFetcher";
import getApiUrl from "../../utils/BeUrl";

export default function useAllUtenti() {
  const fetcher = getAxiosFetcher;
  const { data, error, isLoading } = useSWR(
    getApiUrl() + "api/utente/all",
    fetcher
  );
  return {
    utenteList: data,
    isLoading,
    isError: error,
  };
}
