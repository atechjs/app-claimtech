import React from "react";
import { Chip } from "@mui/material";
export default function ChipValorizzazioneValuta({
  valorizzazione,
  codiceValuta,
}) {
  return (
    <Chip
      label={valorizzazione + " " + codiceValuta}
      variant="outlined"
      color="secondary"
      size="small"
    />
  );
}
