import { Stack, Typography } from "@mui/material";
import React from "react";

export default function LabelInformazione({ label, value }) {
  return (
    <Stack direction={"column"}>
      <Typography variant="button">
        <b>{label}</b>
      </Typography>
      <Typography>{value}</Typography>
    </Stack>
  );
}
