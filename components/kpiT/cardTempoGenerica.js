import { Paper, Stack, Typography } from "@mui/material";
import Tag from "../tag";
import CardLayout from "./cardLayout";

export default function CardTempoGenerica({ label, value, color }) {
  return (
    <Paper>
      <CardLayout>
        <Stack direction={"row"} spacing={1}>
          <Tag colore={color} label={label} />
        </Stack>
        <Typography variant="h6">{value}</Typography>
      </CardLayout>
    </Paper>
  );
}
