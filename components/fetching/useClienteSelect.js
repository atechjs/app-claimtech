import useSWR from "swr";
import { getAxiosFetcher } from "../../utils/AxiosFetcher";
import getApiUrl from "../../utils/BeUrl";

export default function useClienteSelect() {
  const fetcher = getAxiosFetcher;
  const { data, error, isLoading } = useSWR(
    getApiUrl() + "api/cliente/select",
    fetcher
  );
  return {
    clientiList: [{ value: null, label: "TUTTI" }].concat(data),
    isLoading,
    isError: error,
  };
}
