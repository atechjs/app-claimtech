import useSWR from "swr";
import { getAxiosFetcher } from "../../utils/AxiosFetcher";
import getApiUrl from "../../utils/BeUrl";

export default function useAllWorkflowsGestioneReclamo() {
  const fetcher = getAxiosFetcher;
  const { data, error, isLoading } = useSWR(
    getApiUrl() + "api/workflowGestioneReclamo/all",
    fetcher
  );
  return {
    dataList: data,
    isLoading,
    isError: error,
  };
}
