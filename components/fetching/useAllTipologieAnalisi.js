import useSWR from "swr";
import { getAxiosFetcher } from "../../utils/AxiosFetcher";
import getApiUrl from "../../utils/BeUrl";

export default function useAllTipologieAnalisi() {
  const fetcher = getAxiosFetcher;
  const { data, error, isLoading } = useSWR(
    getApiUrl() + "api/tipologiaAnalisi/all",
    fetcher
  );
  return {
    dataList: data,
    isLoading,
    isError: error,
  };
}
