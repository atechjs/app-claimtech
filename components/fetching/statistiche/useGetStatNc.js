import useSWRMutation from "swr/mutation";

import getApiUrl from "../../../utils/BeUrl";
import GetCurrentAxiosInstance from "../../../utils/Axios";
import { useEffect } from "react";

export default function useGetStatNc(id) {
  const instance = GetCurrentAxiosInstance();

  async function getTagById(url, { arg }) {
    return instance
      .get(
        url +
          "?dataInizio=" +
          arg.dataInizio.format("DD/MM/YYYY") +
          "&dataFine=" +
          arg.dataFine.format("DD/MM/YYYY") +
          "&idValuta=" +
          arg.idValuta +
          "&raggruppamento=" +
          arg.raggruppamento
      )
      .then((response) => {
        return response.data;
      })
      .catch((error) => console.log("error", error));
  }
  const { trigger, data, isMutating } = useSWRMutation(
    getApiUrl() + "api/statistica/noteAccredito",
    getTagById,
    id
  );

  return {
    data,
    trigger,
    isMutating,
  };
}
