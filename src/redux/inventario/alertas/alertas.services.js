import api from "../../../services/axios.services";

class AlertasServices {

  // Método para obtener las alertas desde la API
  getAlertas = (params) => 
    api.get("alertas_tienda/", {
      params: params,
      headers: { "Content-Type": "application/json" },
    });

  
  getAlertaById = (id) =>
    api.get(
      `alertas_tienda/${id}/`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
}
  
export default new AlertasServices();
