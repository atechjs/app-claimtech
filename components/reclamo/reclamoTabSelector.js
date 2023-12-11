import { Box, Paper } from "@mui/material";
import React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useRouter } from "next/router";

export default function ReclamoTabSelector({ id, value }) {
  const router = useRouter();
  const handleChange = (newValue) => {
    router.replace("/reclamo/" + id + "/" + newValue);
  };
  return (
    <Paper square>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={(event, newValue) => handleChange(newValue)}
            aria-label="basic tabs example"
          >
            <Tab label="Generale" value="generale" />
            <Tab label="Fornitura" value="fornitura" />
            <Tab label="Evidenze" value="evidenze" />
            <Tab label="Resi" value="resi" />
            <Tab label="Note accredito" value="noteAccredito" />
            <Tab label="Note" value="note" />
            <Tab label="Condivisione" value="condivisione" />
            <Tab label="Tags" value="tags" />
            <Tab label="Storico" value="storico" />
            <Tab label="Elimina" value="elimina" />
          </Tabs>
        </Box>
      </Box>
    </Paper>
  );
}
