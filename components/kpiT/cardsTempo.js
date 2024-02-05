import { Stack } from "@mui/material";
import CardTempoGenerica from "./cardTempoGenerica";
import dayjs from "dayjs";
import CardContainer from "./cardContainer";

export default function CardsTempo({ minTempo, maxTempo, avgTempo }) {
  var duration = require("dayjs/plugin/duration");
  dayjs.extend(duration);
  var relativeTime = require("dayjs/plugin/relativeTime");
  dayjs.extend(relativeTime);

  const fromSecondsToLeggibile = (val) => {
    if (!val || val === null) return "-";
    return dayjs
      .duration(val, "seconds")
      .format("M[ mesi] D[ giorni] H[ ore] m[ minuti]");
  };

  return (
    <CardContainer>
      <CardTempoGenerica
        label={"TEMPO MINIMO"}
        value={fromSecondsToLeggibile(minTempo)}
        color="green"
      />
      <CardTempoGenerica
        label={"TEMPO MEDIO"}
        value={fromSecondsToLeggibile(avgTempo)}
        color="orange"
      />
      <CardTempoGenerica
        label={"TEMPO MASSIMO"}
        value={fromSecondsToLeggibile(maxTempo)}
        color="red"
      />
    </CardContainer>
  );
}
