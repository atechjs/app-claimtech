import { Box, Divider, Paper, Stack, Typography } from "@mui/material";
import Tag from "../../tag";
import { CategoriaGestioneReclami } from "./categoriaGestioneReclami";
import { Conteggio } from "./conteggio";

export const GestioneReclamiCustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const originalData = payload[0].payload;
    return (
      <Paper>
        <Stack p={2} width={"500px"}>
          <Stack
            bgcolor={"primary.main"}
            alignItems="center"
            justifyContent="center"
          >
            <Typography color={"white"}>{label}</Typography>
          </Stack>
          <Stack
            direction={"row"}
            width={"100%"}
            spacing={2}
            justifyContent="space-between"
          >
            <CategoriaGestioneReclami label={"Chiusi"}>
              <Conteggio
                label={"Chiusi"}
                value={originalData.chiusi_questo_mese}
                valore={originalData.sum_chiusi_questo_mese}
                colore={payload[0].fill}
              />
            </CategoriaGestioneReclami>
            <Divider flexItem orientation="vertical" />
            <CategoriaGestioneReclami label={"Aperti"}>
              <Conteggio
                label={"Del mese"}
                value={originalData.aperti_questo_mese}
                valore={originalData.sum_aperti_questo_mese}
                colore={payload[1].fill}
              />
              <Conteggio
                label={"Precedente"}
                value={originalData.di_cui_dal_mese_precedente}
                valore={originalData.sum_di_cui_dal_mese_precedente}
                colore={payload[2].fill}
              />
              <Conteggio
                label={"≥ 2 mesi - a rateo"}
                value={originalData.di_cui_rateo}
                valore={originalData.sum_di_cui_rateo}
                colore={payload[3].fill}
              />
              <Conteggio
                label={"≥ 2 mesi - NO rateo"}
                value={originalData.di_cui_da_piu_di_un_mese}
                valore={originalData.sum_di_cui_da_piu_di_un_mese}
                colore={payload[4].fill}
              />
            </CategoriaGestioneReclami>
          </Stack>
        </Stack>
      </Paper>
    );
  }
  return null;
};
