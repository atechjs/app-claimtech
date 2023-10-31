import { Box, Button } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";

export default function Page() {
  const router = useRouter();
  return (
    <Box>
      <h1>Dettaglio reclamo</h1>
      <Button onClick={() => router.back()}>TORNA INDIETRO</Button>
    </Box>
  );
}
