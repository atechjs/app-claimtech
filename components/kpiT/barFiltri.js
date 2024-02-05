import { Box, Button } from "@mui/material";
import LayoutBarFiltri from "../menuFiltri/layoutBarFiltri";
import NetworkPingIcon from "@mui/icons-material/NetworkPing";
export default function BarFiltri() {
  return (
    <LayoutBarFiltri icon={<NetworkPingIcon />} title={"KPI"}>
      <Box p={2}></Box>
    </LayoutBarFiltri>
  );
}
