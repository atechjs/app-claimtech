import useSWR from "swr";
import getApiUrl from "../../utils/BeUrl";
import GetCurrentAxiosInstance from "../../utils/Axios";

export default function useGetProfilo(username, onS) {
  const instance = GetCurrentAxiosInstance();
  const fetcher = (url, username) =>
    instance
      .get(url, {
        params: {
          username: username,
        },
      })
      .then((res) => res.data);
  const { data, error, isLoading, mutate, isValidating } = useSWR(
    username !== null ? [getApiUrl() + "api/utente/profilo", username] : null,
    ([url, username]) => fetcher(url, username),
    { onSuccess: (values) => onS(values) }
  );
  return {
    profilo: data,
    isLoading,
    isValidating,
    isError: error,
    mutate,
    isValidating,
  };
}
