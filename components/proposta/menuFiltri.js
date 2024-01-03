import LayoutMenuFiltri from "../menuFiltri/layoutMenuFiltri";
import BarFiltri from "./barFiltri";

export default function MenuFiltri({
  filtroSelezionato,
  filterList,
  isLoading,
  onFilterSelected,
}) {
  return (
    <LayoutMenuFiltri
      barFiltri={<BarFiltri />}
      filterList={filterList}
      filtroSelezionato={filtroSelezionato}
      onFilterSelected={onFilterSelected}
      isLoading={isLoading}
    ></LayoutMenuFiltri>
  );
}
