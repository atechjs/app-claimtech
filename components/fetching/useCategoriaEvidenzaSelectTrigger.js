import useSWR from "swr";
import { getAxiosFetcher } from "../../utils/AxiosFetcher";
import getApiUrl from "../../utils/BeUrl";
import useSWRMutation from "swr/mutation";

export default function useCategoriaEvidenzaSelectTrigger(onSuccess) {
  const fetcher = getAxiosFetcher;
  const { data, mutate, error, isLoading, trigger } = useSWRMutation(
    getApiUrl() + "api/evidenza/categoriaSelect",
    fetcher,
    { onSuccess: (values) => onSuccess(values) }
  );
  return {
    data,
    trigger,
    mutate,
    isLoading,
    isError: error,
  };
}
