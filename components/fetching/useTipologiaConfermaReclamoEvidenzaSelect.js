import useSWR from "swr";
import { getAxiosFetcher } from "../../utils/AxiosFetcher";
import getApiUrl from "../../utils/BeUrl";

export default function useTipologiaConfermaReclamoEvidenzaSelect() {
  const fetcher = getAxiosFetcher;
  const { data, error, isLoading, mutate } = useSWR(
    getApiUrl() + "api/evidenza/tipologiaConfermaReclamoEvidenzaSelect",
    fetcher
  );
  return {
    data,
    mutate,
    isLoading,
    isError: error,
  };
}
