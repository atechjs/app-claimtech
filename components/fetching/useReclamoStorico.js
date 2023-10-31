import useSWRMutation from "swr/mutation";

import getApiUrl from "../../utils/BeUrl";
import GetCurrentAxiosInstance from "../../utils/Axios";

export default function useReclamoStorico(arg) {
  const instance = GetCurrentAxiosInstance();

  async function getById(url, { arg }) {
    return instance
      .get(url + "?idReclamo=" + arg.idReclamo + "&id=" + arg.id)
      .then((response) => {
        return response.data;
      })
      .catch((error) => console.log("error", error));
  }
  const { trigger, data, isMutating } = useSWRMutation(
    getApiUrl() + "api/reclamo/storico",
    getById,
    arg
  );

  return {
    data,
    trigger,
    isMutating,
  };
}
