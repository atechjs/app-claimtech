import useSWRMutation from "swr/mutation";

import getApiUrl from "../../utils/BeUrl";
import GetCurrentAxiosInstance from "../../utils/Axios";

export default function useNextStatiFornituraCausaReclamo(id) {
  const instance = GetCurrentAxiosInstance();

  async function getById(url, { arg }) {
    console.log("arg", arg);
    return instance
      .get(
        url +
          "?idStato=" +
          arg.idStato +
          (arg.idFornituraCausaReclamo && arg.idFornituraCausaReclamo !== null
            ? "&idFornituraCausaReclamo=" + arg.idFornituraCausaReclamo
            : "")
      )
      .then((response) => {
        return response.data;
      })
      .catch((error) => console.log("error", error));
  }
  const { trigger, data, isMutating } = useSWRMutation(
    getApiUrl() + "api/reclamo/nextStati",
    getById,
    id
  );

  return {
    data,
    trigger,
    isMutating,
  };
}
