import { Button, Container, Typography } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";

export default function Page() {
  const router = useRouter();
  return (
    <Container maxWidth="lg">
      <Typography variant="h5">CLAIMTECH - Gestionale reclami</Typography>
      <Typography variant="h6">©Atech.js</Typography>
      <Button
        variant="contained"
        className="bg-primary"
        onClick={() => router.replace("/login")}
      >
        Vai al login
      </Button>
    </Container>
  );
}
