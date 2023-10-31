import useSWR from "swr";
import { getAxiosFetcher } from "../../utils/AxiosFetcher";
import getApiUrl from "../../utils/BeUrl";

export default function useAllSistemaEsternoSelect() {
  const fetcher = getAxiosFetcher;
  const { data, error, isLoading } = useSWR(
    getApiUrl() + "api/sistemaEsterno/select",
    fetcher
  );
  return {
    sistemaEsternoList: data,
    isLoading,
    isError: error,
  };
}
