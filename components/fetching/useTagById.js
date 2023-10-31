import useSWRMutation from "swr/mutation";

import getApiUrl from "../../utils/BeUrl";
import GetCurrentAxiosInstance from "../../utils/Axios";

export default function useTagById(id) {
  const instance = GetCurrentAxiosInstance();

  async function getTagById(url, { arg }) {
    return instance
      .get(url + "?id=" + arg.id)
      .then((response) => {
        return response.data;
      })
      .catch((error) => console.log("error", error));
  }
  const { trigger, data, isMutating } = useSWRMutation(
    getApiUrl() + "api/tag/tag",
    getTagById,
    id
  );

  return {
    data,
    trigger,
    isMutating,
  };
}
