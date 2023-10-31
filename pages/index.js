import { Button, Container, Typography } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";

export default function Page() {
  const router = useRouter();
  return (
    <Container maxWidth="lg">
      <Typography variant="h5">CLAIMOT - Gestionale reclami</Typography>
      <Typography variant="h6">©Mondorevive Group S.p.A.</Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => router.replace("/login")}
      >
        Vai al login
      </Button>
    </Container>
  );
}
