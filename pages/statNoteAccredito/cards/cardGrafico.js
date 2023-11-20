import { Paper, Stack, Typography } from "@mui/material";
import React from "react";

export default function CardGrafico({ title, children }) {
  return (
    <Paper>
      <Stack direction={"column"} spacing={1} p={1} width={"100%"}>
        <Typography variant="button">{title}</Typography>
        {children}
      </Stack>
    </Paper>
  );
}
