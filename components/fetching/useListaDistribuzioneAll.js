import useSWR from "swr";
import { getAxiosFetcher } from "../../utils/AxiosFetcher";
import getApiUrl from "../../utils/BeUrl";

export default function useListaDistribuzioneAll() {
  const fetcher = getAxiosFetcher;
  const { data, error, isLoading } = useSWR(
    getApiUrl() + "api/listaDistribuzione/all",
    fetcher
  );
  return {
    data: data,
    isLoading,
    isError: error,
  };
}
