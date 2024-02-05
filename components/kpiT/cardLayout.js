import { Stack } from "@mui/material";

export default function CardLayout({ children }) {
  return (
    <Stack
      direction={"column"}
      spacing={0.5}
      p={1}
      justifyContent="start"
      alignItems="center"
    >
      {children}
    </Stack>
  );
}
