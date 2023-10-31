import useSWR from "swr";

import getApiUrl from "../../utils/BeUrl";
import GetCurrentAxiosInstance from "../../utils/Axios";

export default function useReclamoCondivisione(id, onS) {
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
    id ? [getApiUrl() + "api/reclamo/condivisione", id] : null,
    ([url, id]) => fetcherReclami(url, id),
    { onSuccess: (data) => onS(data) }
  );

  return { data, mutate, isMutating, error };
}
