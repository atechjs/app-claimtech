import useSWR from "swr";
import { getAxiosFetcher } from "../../utils/AxiosFetcher";
import getApiUrl from "../../utils/BeUrl";

export default function useFormVisualizzazioniSelect() {
  const fetcher = getAxiosFetcher;
  const { data, error, isLoading } = useSWR(
    getApiUrl() + "api/form/visualizzazioniSelect",
    fetcher
  );
  return {
    visualizzazioniList: data,
    isLoading,
    isError: error,
  };
}
