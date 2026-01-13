import api from "../../../services/axios.services";

class RecargasSummaryServices {

  getRecargaSummary = (params) =>
    api.get(
      "venta_recarga_metodo_pago/resumen_por_metodo_pago/",
      {
        headers: { "Content-Type": "application/json" },
        params: params,
      }
    );

}

export default new RecargasSummaryServices();
