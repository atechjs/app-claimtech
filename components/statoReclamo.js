import React from "react";
import Tag from "./tag";

export default function StatoReclamo({ aperto, codiceTipologiaReclamo }) {
  const calcolaIniziale = (str) => {
    if (str === undefined || str === null) return "";
    if (str.length < 3) return str;
    return str.substring(0, 3);
  };

  return (
    <Tag
      colore={aperto ? "green" : "red"}
      variante="outlined"
      fontSize="small"
      label={calcolaIniziale(codiceTipologiaReclamo)}
    />
  );
}
