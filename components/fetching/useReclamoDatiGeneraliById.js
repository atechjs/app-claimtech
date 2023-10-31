import useSWR from "swr";

import getApiUrl from "../../utils/BeUrl";
import GetCurrentAxiosInstance from "../../utils/Axios";
import axios from "axios";

export default function useReclamoDatiGeneraliById(id, token, onErrorCall) {
  const instance = axios.create();
  instance.defaults.headers.common["Authorization"] = "Bearer " + token;
  instance.defaults.headers.common["Access-Control-Allow-Origin"] = "*";

  const fetcherReclami = (url, id) =>
    instance
      .get(url, {
        params: {
          id: id,
        },
      })
      .then((res) => res.data);
  const { data, mutate, isMutating, error } = useSWR(
    id ? [getApiUrl() + "api/reclamo/reclamo", id] : null,
    ([url, id]) => fetcherReclami(url, id),
    {
      onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
        onErrorCall();
      },
    }
  );

  return { data: data, mutate, isMutating, error };
}
