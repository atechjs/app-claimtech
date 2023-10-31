import GetCurrentAxiosInstance from "./Axios";

export const getAxiosFetcher = (url) =>
  GetCurrentAxiosInstance()
    .get(url)
    .then((res) => res.data);
