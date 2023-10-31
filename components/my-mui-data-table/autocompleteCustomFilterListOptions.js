export default function autocompleteCustomFilterListOptions(actionSalvataggio) {
  return {
    render: (v) =>
      v
        .filter((x) => x !== undefined && x !== null)
        .map((l) => l.label.toUpperCase()),
    update: (filterList, filterPos, index) => {
      filterList[index].splice(filterPos, 1);
      actionSalvataggio.resetFiltro(index);
      return filterList;
    },
  };
}
