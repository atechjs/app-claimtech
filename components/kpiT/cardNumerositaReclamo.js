import { Paper, Stack, Typography } from "@mui/material";
import CardLayout from "./cardLayout";

export default function CardNumerositaReclamo({ label, count }) {
  return (
    <Paper>
      <CardLayout>
        <Typography variant="h5" color={"primary"}>
          {label}
        </Typography>
        <Stack direction={"row"}>
          <Typography variant="h5">{count}</Typography>
        </Stack>
      </CardLayout>
    </Paper>
  );
}
