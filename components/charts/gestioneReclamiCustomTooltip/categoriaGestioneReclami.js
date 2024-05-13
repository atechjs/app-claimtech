import { Stack, Typography } from "@mui/material";

export const CategoriaGestioneReclami = ({ label, children }) => {
  return (
    <Stack direction={"column"} width={"50%"} alignItems={"center"}>
      <Typography>
        <b>{label}</b>
      </Typography>
      <Stack
        direction={"column"}
        spacing={1}
        justifyContent="flex-start"
        width={"100%"}
      >
        {children}
      </Stack>
    </Stack>
  );
};
