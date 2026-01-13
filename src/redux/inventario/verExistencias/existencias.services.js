import api from "services/axios.services";

class ExistenciasServices {
    getExistencias = (params) => 
      api.get("producto_asignado/", {
        params: params,
        headers: { "Content-Type": "application/json" },
      });

      getExistenciasEmpleados = (params) => 
        api.get("producto_asignado_empleados/", {
          params: params,
          headers: { "Content-Type": "application/json" },
        });
  }
    
  export default new ExistenciasServices();
  