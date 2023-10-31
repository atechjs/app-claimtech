export const getPartitaList = (columnsData, list) => {
  let finalPartitaList = [];
  //Devo prendere iCausaReclamoList del primo elemento
  const idCausaReclamoList = list[0].idCausaReclamoList;

  list.forEach((partita) => {
    partita = { ...partita, id: null, codicePartitaCliente: "" };
    let causaReclamoList = [];
    idCausaReclamoList.forEach((fornituraCausaReclamo) => {
      let campi = [];
      columnsData.forEach(
        (colonna) => (campi = [...campi, { codice: colonna.codice, value: 0 }])
      );

      let objCausaReclamo = {
        id: null,
        idStato: partita.idStato,
        codiceStato: partita.codiceStato,
        azzeraPartita: false,
        idCausa: fornituraCausaReclamo.value,
        codiceCausa: fornituraCausaReclamo.label,
        valoreContestazione: 0,
        valoreContestazioneCliente: 0,
        campi: campi,
      };

      causaReclamoList = [...causaReclamoList, objCausaReclamo];
    });
    partita = { ...partita, causaReclamoList: causaReclamoList };
    finalPartitaList = [...finalPartitaList, partita];
  });
  return finalPartitaList;
};
