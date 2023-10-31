import useSWR from "swr";
import { getAxiosFetcher } from "../../utils/AxiosFetcher";
import getApiUrl from "../../utils/BeUrl";

export default function useAllStabilimenti() {
  const fetcher = getAxiosFetcher;
  const { data, error, isLoading } = useSWR(
    getApiUrl() + "api/stabilimento/all",
    fetcher
  );
  return {
    stabilimentiList: data,
    isLoading,
    isError: error,
  };
}
