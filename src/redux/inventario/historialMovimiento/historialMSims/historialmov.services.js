import api from "../../../services/axios.services";

class HistorialMServices {
    getHistorial = (params) => 
      api.get("historial_movimiento/", {
        params: params,
        headers: { "Content-Type": "application/json" },
      });
  }
    
  export default new HistorialMServices();
  