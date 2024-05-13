import { Stack, Typography } from "@mui/material";
import Tag from "../../tag";

export const Conteggio = ({ label, valore, value, colore }) => {
  const getLabel = () => {
    return valore !== undefined
      ? label + " ( " + Math.round(valore, 2) + "€ )"
      : label;
  };
  return (
    <Stack
      direction={"row"}
      spacing={1}
      justifyContent="flex-start"
      alignItems="center"
    >
      <Tag colore={colore} label={value} />
      <Typography>{getLabel()}</Typography>
    </Stack>
  );
};
