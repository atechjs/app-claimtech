import Sezione from "./sezione";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import CardsTempo from "../../components/kpiT/cardsTempo";
import { Typography } from "@mui/material";

export default function SezioneTempiGenerica({
  titolo,
  descrizione,
  minTempo,
  maxTempo,
  avgTempo,
}) {
  return (
    <Sezione
      label={titolo}
      icon={<AccessTimeFilledIcon color="primary" fontSize="medium" />}
      subsection
    >
      <Typography>{descrizione}</Typography>
      <CardsTempo minTempo={minTempo} maxTempo={maxTempo} avgTempo={avgTempo} />
    </Sezione>
  );
}
