import React from "react";
import { Chip } from "@mui/material";
export default function ChipValorizzazioneEuro({ valorizzazione }) {
  return (
    <Chip
      label={<b>{valorizzazione + " " + "EUR"}</b>}
      variant="outlined"
      color="success"
      size="small"
    />
  );
}
