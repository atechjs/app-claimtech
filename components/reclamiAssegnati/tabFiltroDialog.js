import { Stack } from "@mui/material";

export default function TabFiltroDialog({ value, index, children }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      <Stack spacing={1} direction={"column"}>
        {children}
      </Stack>
    </div>
  );
}
