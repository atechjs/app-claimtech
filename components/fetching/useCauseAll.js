import useSWR from "swr";
import { getAxiosFetcher } from "../../utils/AxiosFetcher";
import getApiUrl from "../../utils/BeUrl";

export default function useCauseAll() {
  const fetcher = getAxiosFetcher;
  const { data, error, isLoading } = useSWR(
    getApiUrl() + "api/causaReclamo/all",
    fetcher
  );
  return {
    causaList: data,
    isLoading,
    isError: error,
  };
}
