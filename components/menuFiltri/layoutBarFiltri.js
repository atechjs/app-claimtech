import { Box, Divider, Paper, Stack, Typography } from "@mui/material";

export default function LayoutBarFiltri({ icon, title, children }) {
  return (
    <div className="">
      <Stack direction={"column"} className="">
        <Box
          sx={{
            display: "flex",
          }}
          pr={1}
          pl={1}
          className="mt-4 mb-2"
        >
          <Stack
            direction={"row"}
            justifyContent="flex-start"
            alignItems="center"
            spacing={1}
            mr={3}
            
          >
            {icon}
            <p className="ext-gray-800 font-medium">
              {title}
            </p>
          </Stack>
          {children}
        </Box>
        <Divider />
      </Stack>
    </div>
  );
}
