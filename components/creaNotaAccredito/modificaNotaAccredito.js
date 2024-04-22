import dayjs from "dayjs";
import GetCurrentAxiosInstance from "../../utils/Axios";
import DatiNotaAccredito from "./datiNotaAccredito";
import getApiUrl from "../../utils/BeUrl";
import { mandaNotifica } from "../../utils/ToastUtils";

export default function ModificaNotaAccredito({
  notaAccredito,
  onSubmitNotaAccredito,
}) {
  const instance = GetCurrentAxiosInstance();
  const internalSubmit = (values) => {
    //TODO
    instance
      .post(getApiUrl() + "api/reclamo/updateNotaAccredito", {
        id: notaAccredito.id,
        ...values,
      })
      .then((response) => {
        mandaNotifica("Nota accredito aggiornata con successo", "success");
        onSubmitNotaAccredito();
      })
      .catch(() =>
        mandaNotifica(
          "Non è stato possibile aggiornare la nota accredito",
          "error"
        )
      );
  };

  return (
    <DatiNotaAccredito
      onFormSubmit={internalSubmit}
      initialValues={{
        codice: notaAccredito.codice,
        tipo: notaAccredito.tipo,
        anno: notaAccredito.anno,
        numero: notaAccredito.numero,
        data: dayjs(notaAccredito.data),
      }}
    />
  );
}
