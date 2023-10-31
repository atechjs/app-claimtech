export const getCodiciLineaUnivoci = (codiceLineaList) => {
  let map = {};
  codiceLineaList.forEach((cod) => (map = { ...map, [cod]: true }));
  return Object.keys(map);
};
