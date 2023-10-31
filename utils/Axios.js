import axios from "axios";
import authServ from "../services/auth.service";

export default function GetCurrentAxiosInstance() {
  const instance = axios.create();
  instance.defaults.headers.common["Authorization"] =
    "Bearer " + authServ.getCurrentJwtToken();
  instance.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
  return instance;
}

export function GetCurrentUser() {
  return authServ.getCurrentUser();
}
