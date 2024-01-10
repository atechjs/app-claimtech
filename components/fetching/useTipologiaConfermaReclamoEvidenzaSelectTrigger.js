import { getAxiosFetcher } from "../../utils/AxiosFetcher";
import getApiUrl from "../../utils/BeUrl";
import useSWRMutation from "swr/mutation";

export default function useTipologiaConfermaReclamoEvidenzaSelectTrigger(
  onSuccess
) {
  const fetcher = getAxiosFetcher;
  const { data, error, isLoading, mutate, trigger } = useSWRMutation(
    getApiUrl() + "api/evidenza/tipologiaConfermaReclamoEvidenzaSelect",
    fetcher,
    { onSuccess: (values) => onSuccess(values) }
  );
  return {
    data,
    mutate,
    isLoading,
    isError: error,
    trigger: trigger,
  };
}
