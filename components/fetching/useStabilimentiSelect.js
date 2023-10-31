import useSWR from "swr";
import { getAxiosFetcher } from "../../utils/AxiosFetcher";
import getApiUrl from "../../utils/BeUrl";

export default function useStabilimentiSelect() {
  const fetcher = getAxiosFetcher;
  const { data, error, isLoading } = useSWR(
    getApiUrl() + "api/stabilimento/select",
    fetcher
  );
  return {
    stabilimentiList: data,
    isLoading,
    isError: error,
  };
}
