import { debounceSearchRender } from "./debounceSearchRender";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
export default function GenericSearchRender(debounceWait = 200) {
  return debounceSearchRender(debounceWait, "RICERCA", <ManageSearchIcon />);
}
