import React from "react";
import { Chip } from "@mui/material";
export default function ChipValorizzazioneEuro({ valorizzazione }) {
  return (
    <Chip
      label={
        <b>
          {Math.round((valorizzazione + Number.EPSILON) * 100) / 100 +
            " " +
            "EUR"}
        </b>
      }
      variant="outlined"
      color="success"
      size="small"
    />
  );
}
