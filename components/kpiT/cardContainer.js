import { Stack } from "@mui/material";

export default function CardContainer({ children }) {
  return (
    <Stack
      direction="row"
      justifyContent="space-evenly"
      alignItems="center"
      spacing={2}
    >
      {children}
    </Stack>
  );
}
