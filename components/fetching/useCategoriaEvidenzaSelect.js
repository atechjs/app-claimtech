import useSWR from "swr";
import { getAxiosFetcher } from "../../utils/AxiosFetcher";
import getApiUrl from "../../utils/BeUrl";

export default function useCategoriaEvidenzaSelect() {
  const fetcher = getAxiosFetcher;
  const { data, mutate, error, isLoading } = useSWR(
    getApiUrl() + "api/evidenza/categoriaSelect",
    fetcher
  );
  return {
    data,
    mutate,
    isLoading,
    isError: error,
  };
}
