export const getCodiciCausaUnivoci = (list) => {
  let map = {};
  list.forEach((c) => (map = { ...map, [c]: true }));
  return Object.keys(map);
};
