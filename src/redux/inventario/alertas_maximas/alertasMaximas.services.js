import api from "../../../services/axios.services";

class AlertasMaxServices {

  // Método para obtener las alertas desde la API
  getAlertasMax = (params) => 
    api.get("alertas_max_tienda/", {
      params: params,
      headers: { "Content-Type": "application/json" },
    });

  
  getAlertaMaxById = (id) =>
    api.get(
      `alertas_max_tienda/${id}/`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
}
  
export default new AlertasMaxServices();
