import CardContainer from "./cardContainer";
import CardNumerositaReclamo from "./cardNumerositaReclamo";

export default function CardsNumerositaReclami({ data }) {
  const somma = () => {
    return data.reduce((partialSum, a) => partialSum + a.count, 0);
  };
  return (
    <CardContainer>
      {data.map((c) => (
        <CardNumerositaReclamo label={c.label} count={c.count} />
      ))}
      <CardNumerositaReclamo label={"TOTALE"} count={somma()} />
    </CardContainer>
  );
}
