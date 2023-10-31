import useSWR from "swr";
import { getAxiosFetcher } from "../../utils/AxiosFetcher";
import getApiUrl from "../../utils/BeUrl";

export default function useRuoliSelect() {
  const fetcher = getAxiosFetcher;
  const { data, error, isLoading } = useSWR(
    getApiUrl() + "api/utente/ruoli",
    fetcher
  );
  return {
    ruoliList: data,
    isLoading,
    isError: error,
  };
}
