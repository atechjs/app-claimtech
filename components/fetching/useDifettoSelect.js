import useSWR from "swr";
import { getAxiosFetcher } from "../../utils/AxiosFetcher";
import getApiUrl from "../../utils/BeUrl";

export default function useDifettoSelect() {
  const fetcher = getAxiosFetcher;
  const { data, error, isLoading } = useSWR(
    getApiUrl() + "api/difetto/select",
    fetcher
  );
  return {
    difettoList: data,
    isLoading,
    isError: error,
  };
}
