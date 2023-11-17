import useSWR from "swr";
import { getAxiosFetcher } from "../../utils/AxiosFetcher";
import getApiUrl from "../../utils/BeUrl";

export default function useValutaSelect(onS) {
  const fetcher = getAxiosFetcher;
  const { data, error, isLoading } = useSWR(
    getApiUrl() + "api/valuta/select",
    fetcher,
    {
      onSuccess: (values) => (onS !== undefined ? onS(values) : null),
    }
  );
  return {
    valutaList: data,
    isLoading,
    isError: error,
  };
}
