import useSWRMutation from "swr/mutation";

import getApiUrl from "../../utils/BeUrl";
import GetCurrentAxiosInstance from "../../utils/Axios";

export default function useListaApprovazioneById(id) {
  const instance = GetCurrentAxiosInstance();

  async function getById(url, { arg }) {
    return instance
      .get(url + "?id=" + arg.id)
      .then((response) => {
        return response.data;
      })
      .catch((error) => console.log("error", error));
  }
  const { trigger, data, isMutating } = useSWRMutation(
    getApiUrl() + "api/listaApprovazione/listaApprovazione",
    getById,
    id
  );

  return {
    data,
    trigger,
    isMutating,
  };
}
