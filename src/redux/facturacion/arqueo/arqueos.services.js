import api from "../../../services/axios.services";

class ArqueosServices {

  getArqueos = (params) =>
    api.get(
      "arqueo/",
      {
        headers: { "Content-Type": "application/json" },
        params: params,
      }
    );
  
    getDenominaciones = (params) =>
      api.get(
        "denominacion/",
        {
          headers: { "Content-Type": "application/json" },
          params: params,
        }
      );

  getResumenMetodoPago = (params) =>
    api.get(
      "venta_metodo_pago/resumen_por_metodo_pago/",
      {
        headers: { "Content-Type": "application/json" },
        params: params,
      }
    );
  

  getArqueoByID = (id) =>
    api.get(
      `detalle_arqueo/${id}/`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

  saveArqueo = (data) =>
    api.post(
      "arqueo/",
      data,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

}

export default new ArqueosServices();
