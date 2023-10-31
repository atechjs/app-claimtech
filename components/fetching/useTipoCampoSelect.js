import useSWR from "swr";
import { getAxiosFetcher } from "../../utils/AxiosFetcher";
import getApiUrl from "../../utils/BeUrl";

export default function useTipoCampoSelect() {
  const fetcher = getAxiosFetcher;
  const { data, error, isLoading } = useSWR(
    getApiUrl() + "api/tipoCampo/select",
    fetcher
  );
  return {
    tipoCampoList: data,
    isLoading,
    isError: error,
  };
}
