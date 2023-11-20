import { Card, Stack, Typography } from "@mui/material";
import React from "react";

export default function CardStatoFornitura({ data }) {
  return (
    <Card>
      <Stack direction={"column"} p={1}>
        <Typography variant="button" color={"primary"}>
          {data.codice}
        </Typography>
        <Typography variant="button">
          Numero: <b>{data.count}</b>
        </Typography>
        <Typography variant="button">
          Valore totale: <b>{data.sum.toFixed(2)}</b>
        </Typography>
      </Stack>
    </Card>
  );
}
