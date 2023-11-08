export const formattaOdl = (odl) => {
  const arr = odl.split("/");
  if (arr.length < 3) return odl;
  return arr[0] + " " + arr[1] + " " + Number(arr[2]);
};

export const formattaPartita = (partita) => {
  //23/CP01001/01
  const arr = partita.split("/");
  if (arr.length < 2) return partita;
  return arr[1].substring(0, 3) + "/" + arr[1].substring(3);
};

export const getNumList = (codiceList) => {
  return codiceList.map((codice) => {
    return Number(formattaPartita(codice).split("/")[1]);
  });
};

export const getPartiteUnivoche = (partitaList) => {
  const formattaList = partitaList.map((cod) => formattaPartita(cod));
  let map = {};
  formattaList.forEach((cod) => (map = { ...map, [cod]: true }));
  return Object.keys(map);
};
