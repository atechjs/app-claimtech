import { Stack } from "@mui/material";
import { getCodiciArticoloUnivoci } from "../../../utils/articoloUtils";
import ChipValorizzazioneValuta from "../../chipValorizzazioneValuta";
import ChipValorizzazioneEuro from "../../chipValorizzazioneEuro";

export default function RenderDatiArticoloValorizzazione({
  codiceArticoloList,
  codiceValuta,
  valorizzazioneValuta,
  valorizzazioneEuro,
}) {
  return (
    <Stack direction={"column"}>
      {getCodiciArticoloUnivoci(codiceArticoloList).map((x) => (
        <span>{x}</span>
      ))}
      <Stack direction={"row"} spacing={1}>
        {codiceValuta !== "EUR" ? (
          <span>
            <ChipValorizzazioneValuta
              valorizzazione={valorizzazioneValuta}
              codiceValuta={codiceValuta}
            />
          </span>
        ) : null}
        <span>
          <ChipValorizzazioneEuro valorizzazione={valorizzazioneEuro} />
        </span>
      </Stack>
    </Stack>
  );
}
