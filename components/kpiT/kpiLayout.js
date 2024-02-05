import { Box, Divider, Paper, Stack } from "@mui/material";
import Sezione from "./sezione";
import AssessmentIcon from "@mui/icons-material/Assessment";
export default function KpiLayout({ titolo, children }) {
  return (
    <Box width={"100%"}>
      <Paper>
        <Stack direction={"column"} spacing={1} p={1} divider={<Divider />}>
          <Sezione
            label={titolo}
            icon={<AssessmentIcon color="primary" fontSize="large" />}
          />
          {children}
        </Stack>
      </Paper>
    </Box>
  );
}
