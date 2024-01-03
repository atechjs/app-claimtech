import useSWR from "swr";
import { getAxiosFetcher } from "../../utils/AxiosFetcher";
import getApiUrl from "../../utils/BeUrl";

export default function useDifettiAll() {
  const fetcher = getAxiosFetcher;
  const { data, error, isLoading } = useSWR(
    getApiUrl() + "api/difetto/all",
    fetcher
  );
  return {
    difettiList: data,
    isLoading,
    isError: error,
  };
}
