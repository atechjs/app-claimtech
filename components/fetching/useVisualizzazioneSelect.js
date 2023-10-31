import useSWR from "swr";
import { getAxiosFetcher } from "../../utils/AxiosFetcher";
import getApiUrl from "../../utils/BeUrl";

export default function useVisualizzazioneSelect() {
  const fetcher = getAxiosFetcher;
  const { data, error, isLoading } = useSWR(
    getApiUrl() + "api/form/visualizzazioniAllSelect",
    fetcher
  );
  return {
    visualizzazioneList: data,
    isLoading,
    isError: error,
  };
}
