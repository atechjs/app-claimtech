import React from "react";
import { Chip } from "@mui/material";
export default function ChipValorizzazioneValuta({
  valorizzazione,
  codiceValuta,
}) {
  return (
    <Chip
      label={
        Math.round((valorizzazione + Number.EPSILON) * 100) / 100 +
        " " +
        codiceValuta
      }
      variant="outlined"
      color="secondary"
      size="small"
    />
  );
}
