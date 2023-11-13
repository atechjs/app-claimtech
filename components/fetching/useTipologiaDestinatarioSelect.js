import useSWR from "swr";
import { getAxiosFetcher } from "../../utils/AxiosFetcher";
import getApiUrl from "../../utils/BeUrl";

export default function useTipologiaDestinatarioSelect() {
  const fetcher = getAxiosFetcher;
  const { data, error, isLoading } = useSWR(
    getApiUrl() + "api/tipologiaDestinatario/select",
    fetcher
  );
  return {
    tipologiaDestinatarioList: data,
    isLoading,
    isError: error,
  };
}
