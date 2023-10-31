import { Stack } from "@mui/material";
import React from "react";

export default function ValueWithIcon({ value, icon }) {
  return (
    <Stack
      direction={"row"}
      justifyContent="flex-start"
      alignItems="center"
      spacing={1}
    >
      {icon}
      <span>{value}</span>
    </Stack>
  );
}
