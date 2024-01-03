import { Box } from "@mui/material";
import LayoutBarFiltri from "../menuFiltri/layoutBarFiltri";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
export default function BarFiltri() {
  return (
    <LayoutBarFiltri icon={<FilterAltOutlinedIcon />} title={"STATO PROPOSTE"}>
      <Box p={2}></Box>
    </LayoutBarFiltri>
  );
}
