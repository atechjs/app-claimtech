import useSWRMutation from "swr/mutation";

import getApiUrl from "../../utils/BeUrl";
import GetCurrentAxiosInstance from "../../utils/Axios";
import useSWR from "swr";

export default function usePropostaById(id, onSuccess) {
  const instance = GetCurrentAxiosInstance();

  async function getById(url, arg) {
    return instance
      .get(url + "?id=" + arg.id)
      .then((response) => {
        return response.data;
      })
      .catch((error) => console.log("error", error));
  }
  const { data, isLoading } = useSWR(
    id && id.id ? [getApiUrl() + "api/proposta/proposta", id] : undefined,
    ([url, id]) => getById(url, id),
    {
      onSuccess: (values) => onSuccess(values),
    }
  );

  return {
    data,
    isLoading,
  };
}
