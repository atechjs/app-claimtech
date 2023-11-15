import useSWR from "swr";
import { getAxiosFetcher } from "../../utils/AxiosFetcher";
import getApiUrl from "../../utils/BeUrl";

export default function useVisualizzazioneSelect(onS) {
  const fetcher = getAxiosFetcher;
  const { data, error, isLoading } = useSWR(
    getApiUrl() + "api/form/visualizzazioniAllSelect",
    fetcher,
    {
      onSuccess: (values) => (onS !== undefined ? onS(values) : null),
    }
  );
  return {
    visualizzazioneList: data,
    isLoading,
    isError: error,
  };
}
