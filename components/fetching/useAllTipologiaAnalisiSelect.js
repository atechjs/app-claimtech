import useSWR from "swr";
import { getAxiosFetcher } from "../../utils/AxiosFetcher";
import getApiUrl from "../../utils/BeUrl";

export default function useAlltipologiaAnalisiSelect() {
  const fetcher = getAxiosFetcher;
  const { data, error, isLoading } = useSWR(
    getApiUrl() + "api/tipologiaAnalisi/select",
    fetcher
  );
  return {
    dataList: data,
    isLoading,
    isError: error,
  };
}
