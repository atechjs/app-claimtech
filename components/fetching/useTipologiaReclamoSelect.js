import useSWR from "swr";
import { getAxiosFetcher } from "../../utils/AxiosFetcher";
import getApiUrl from "../../utils/BeUrl";

export default function useTipologiaReclamoSelect() {
  const fetcher = getAxiosFetcher;
  const { data, error, isLoading } = useSWR(
    getApiUrl() + "api/tipologiaReclamo/select",
    fetcher
  );
  return {
    tipologiaReclamoList: data,
    isLoading,
    isError: error,
  };
}
