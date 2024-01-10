import useSWR from "swr";

import getApiUrl from "../../utils/BeUrl";
import GetCurrentAxiosInstance from "../../utils/Axios";

export default function UseReclamoProposte(id) {
  const instance = GetCurrentAxiosInstance();

  const fetcherReclami = (url, id) =>
    instance
      .get(url, {
        params: {
          id: id,
        },
      })
      .then((res) => res.data);
  const { data, mutate, isMutating, error } = useSWR(
    id ? [getApiUrl() + "api/reclamo/proposte", id] : null,
    ([url, id]) => fetcherReclami(url, id),
    {
      onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
        onErrorCall();
      },
    }
  );

  return { data, mutate, isMutating, error };
}
