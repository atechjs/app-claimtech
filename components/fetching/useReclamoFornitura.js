import useSWRMutation from "swr/mutation";

import getApiUrl from "../../utils/BeUrl";
import GetCurrentAxiosInstance from "../../utils/Axios";

export default function useReclamoFornitura(id) {
  const instance = GetCurrentAxiosInstance();

  async function getById(url, { arg }) {
    return instance
      .get(url + "?id=" + arg.id)
      .then((response) => {
        return response.data;
      })
      .catch((error) => console.log("error", error));
  }
  const { trigger, data, isMutating, isLoading } = useSWRMutation(
    getApiUrl() + "api/reclamo/fornitura",
    getById,
    id
  );

  return {
    data,
    trigger,
    isMutating,
  };
}
