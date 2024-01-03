import useSWR from "swr";
import { getAxiosFetcher } from "../../utils/AxiosFetcher";
import getApiUrl from "../../utils/BeUrl";

export default function useWorkflowGestioneReclamoSelect() {
  const fetcher = getAxiosFetcher;
  const { data, error, isLoading } = useSWR(
    getApiUrl() + "api/workflowGestioneReclamo/select",
    fetcher
  );
  return {
    workflowGestioneReclamoList: data,
    isLoading,
    isError: error,
  };
}
