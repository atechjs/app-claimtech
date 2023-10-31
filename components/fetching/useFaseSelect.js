import useSWRMutation from "swr/mutation";

import getApiUrl from "../../utils/BeUrl";
import GetCurrentAxiosInstance from "../../utils/Axios";

export default function useFaseSelect(id) {
  const instance = GetCurrentAxiosInstance();

  async function getById(url, { arg }) {
    return instance
      .get(url + "?idTipologiaReclamo=" + arg.id)
      .then((response) => {
        return response.data;
      })
      .catch((error) => console.log("error", error));
  }
  const { trigger, data, isMutating } = useSWRMutation(
    getApiUrl() + "api/fase/select",
    getById,
    id
  );

  return {
    data,
    trigger,
    isMutating,
  };
}
