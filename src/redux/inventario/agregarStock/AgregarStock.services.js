import api from "../../../services/axios.services";

class AgregarStockServices {

  getProductoAsignado = (params) =>
    api.get(
      "producto_asignado/",
      {
        headers: { "Content-Type": "application/json" },
        params: params,
        paramsSerializer: (params) => {
          // Serializa los parámetros para manejar arreglos e individuales correctamente
          return Object.entries(params)
            .map(([key, value]) =>
              Array.isArray(value)
                ? value.map(v => `${key}=${encodeURIComponent(v)}`).join('&') // Arreglos: parámetros repetidos
                : `${key}=${encodeURIComponent(value)}` // Valores únicos: serialización normal
            )
            .join('&');
        }
      }
    );

  getUnidad = (params) =>
    api.get(
      "unidad/",
      {
        headers: { "Content-Type": "application/json" },
        params: params,
      }
    );

  deleteUnidad = (id,data) =>
    api.patch(
      `unidad/${id}/`, data,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

  verificarUnidades = (data) =>
    api.post(
      "verificar-numeros-serie/",
      data,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

  saveAddStock = (data, type = "tienda") =>
    api.post(
      type === "empleado" ? "producto_asignado_empleados/" : "producto_asignado/",
      data,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

  saveAddStockUnits = (data) =>
    api.post(
      "unidad/",
      data,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

  editAddStockUnits = (data) =>
    api.put(
      "unidad/bulk-update/",
      data,
      {
        headers: { "Content-Type": "application/json" },
      }
    );



}

export default new AgregarStockServices();
