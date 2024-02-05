import { Box, Divider, Paper, Stack, Typography } from "@mui/material";

export default function Sezione({ label, icon, subsection = false, children }) {
  return (
    <Stack direction={"column"} width={"100%"}>
      <Stack
        direction={"row"}
        justifyContent="flex-start"
        alignItems="center"
        spacing={1}
      >
        {icon}
        <Typography
          variant={!subsection ? "h5" : "h6"}
          color={!subsection ? "text.primary" : "text.secondary"}
        >
          {label}
        </Typography>
      </Stack>
      {children}
    </Stack>
  );
}
