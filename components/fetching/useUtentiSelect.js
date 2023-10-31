import useSWR from "swr";
import { getAxiosFetcher } from "../../utils/AxiosFetcher";
import getApiUrl from "../../utils/BeUrl";

export default function useUtentiSelect() {
  const fetcher = getAxiosFetcher;
  const { data, error, isLoading } = useSWR(
    getApiUrl() + "api/utente/select",
    fetcher
  );
  return {
    utentiList: data,
    isLoading,
    isError: error,
  };
}
