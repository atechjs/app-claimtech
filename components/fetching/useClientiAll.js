import useSWR from "swr";
import { getAxiosFetcher } from "../../utils/AxiosFetcher";
import getApiUrl from "../../utils/BeUrl";

export default function useClientiAll() {
  const fetcher = getAxiosFetcher;
  const { data, error, isLoading } = useSWR(
    getApiUrl() + "api/cliente/all",
    fetcher
  );
  return {
    clientiList: data,
    isLoading,
    isError: error,
  };
}
