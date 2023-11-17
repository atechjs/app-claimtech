import { Paper, Stack } from "@mui/material";
import React from "react";

export default function InputLayout({ children }) {
  return (
    <Paper>
      <Stack p={1}>{children}</Stack>
    </Paper>
  );
}
