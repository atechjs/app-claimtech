import { Box, Divider, Paper, Stack, Typography } from "@mui/material";

export default function LayoutBarFiltri({ icon, title, children }) {
  return (
    <Paper elevation={0} square>
      <Stack direction={"column"}>
        <Box
          sx={{
            display: "flex",
          }}
          pr={1}
          pl={1}
        >
          <Stack
            direction={"row"}
            justifyContent="flex-start"
            alignItems="center"
            spacing={1}
            mr={3}
          >
            {icon}
            <Typography variant="button" noWrap component="div">
              {title}
            </Typography>
          </Stack>
          {children}
        </Box>
        <Divider />
      </Stack>
    </Paper>
  );
}
