import useSWRMutation from "swr/mutation";

import getApiUrl from "../../utils/BeUrl";
import GetCurrentAxiosInstance from "../../utils/Axios";
import useSWR from "swr";

export default function useFornituraPropostaAutorizzata(idReclamoList) {
  const instance = GetCurrentAxiosInstance();

  async function getById(url, arg) {
    return instance
      .get(url + "?idReclamoList=" + arg)
      .then((response) => {
        return response.data;
      })
      .catch((error) => console.log("error", error));
  }
  const { data } = useSWR(
    [getApiUrl() + "api/reclamo/fornituraAutorizzataProposta", idReclamoList],
    ([url, idReclamoList]) => getById(url, idReclamoList)
  );

  return {
    data,
  };
}
