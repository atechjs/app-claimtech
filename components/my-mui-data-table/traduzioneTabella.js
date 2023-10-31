export function getTraduzioneTabella() {
  return {
    body: {
      noMatch: "Nessun record trovato",
      toolTip: "Ordina",
      columnHeaderTooltip: (column) => `Ordina per ${column.label}`,
    },
    pagination: {
      next: "Pagina successiva",
      previous: "Pagina precedente",
      rowsPerPage: "Record per pagina:",
      displayRows: "di",
    },
    toolbar: {
      search: "Ricerca",
      downloadCsv: "Download CSV",
      print: "Stampa",
      viewColumns: "Aggiusta le colonne",
      filterTable: "Filtra la tabella",
    },
    filter: {
      all: "Tutti",
      title: "FILTRI",
      reset: "CANCELLA",
    },
    viewColumns: {
      title: "Mostra le colonne",
      titleAria: "Mostra/Nascondi le colonne",
    },
    selectedRows: {
      text: "righe selezionate",
      delete: "Cancella",
      deleteAria: "Cancella le righe selezionate",
    },
  };
}
