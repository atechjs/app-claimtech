import useSWRMutation from "swr/mutation";

import getApiUrl from "../../utils/BeUrl";
import GetCurrentAxiosInstance from "../../utils/Axios";

export default function useApprovazioneGestione(id) {
  const instance = GetCurrentAxiosInstance();

  async function getById(url, { arg }) {
    return instance
      .get(
        url +
          "?periodo=" +
          arg.periodo +
          "&idStabilimento=" +
          arg.idStabilimento
      )
      .then((response) => {
        return response.data;
      })
      .catch((error) => console.log("error", error));
  }
  const { trigger, data, isMutating } = useSWRMutation(
    getApiUrl() + "api/statistica/approvazioneGestione",
    getById,
    id
  );

  return {
    data,
    trigger,
    isMutating,
  };
}
