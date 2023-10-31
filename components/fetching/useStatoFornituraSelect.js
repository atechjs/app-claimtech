import useSWR from "swr";
import { getAxiosFetcher } from "../../utils/AxiosFetcher";
import getApiUrl from "../../utils/BeUrl";

export default function useStatoFornituraSelect() {
  const fetcher = getAxiosFetcher;
  const { data, error, isLoading } = useSWR(
    getApiUrl() + "api/statoFornitura/select",
    fetcher
  );
  return {
    statoFornituraList: data,
    isLoading,
    isError: error,
  };
}
