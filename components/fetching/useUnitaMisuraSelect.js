import useSWR from "swr";
import { getAxiosFetcher } from "../../utils/AxiosFetcher";
import getApiUrl from "../../utils/BeUrl";

export default function useUnitaMisuraSelect() {
  const fetcher = getAxiosFetcher;
  const { data, error, isLoading } = useSWR(
    getApiUrl() + "api/unitaMisura/select",
    fetcher
  );
  return {
    unitaMisuraList: data,
    isLoading,
    isError: error,
  };
}
