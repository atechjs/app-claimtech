export const formattaArticolo = (articolo) => {
  const arr = articolo.split("/");
  if (arr.length < 3) return articolo;
  return arr[0] + "/" + arr[1] + "/" + arr[2];
};

export const getCodiciArticoloUnivoci = (codiceArticoloList) => {
  const formattaList = codiceArticoloList.map((cod) => formattaArticolo(cod));
  let map = {};
  formattaList.forEach((cod) => (map = { ...map, [cod]: true }));
  return Object.keys(map);
};
