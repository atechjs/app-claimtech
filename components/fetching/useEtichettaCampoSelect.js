import useSWR from "swr";
import { getAxiosFetcher } from "../../utils/AxiosFetcher";
import getApiUrl from "../../utils/BeUrl";

export default function useEtichettaCampoSelect() {
  const fetcher = getAxiosFetcher;
  const { data, error, isLoading } = useSWR(
    getApiUrl() + "api/form/etichetteCampoSelect",
    fetcher
  );
  return {
    etichettaCampoList: data,
    isLoading,
    isError: error,
  };
}
