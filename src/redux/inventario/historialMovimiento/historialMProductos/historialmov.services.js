import api from "../../../../services/axios.services";

class HistorialMServices {
  getHistorial = (params) =>
    api.get("historial_movimiento/", {
      params: params,
      headers: { "Content-Type": "application/json" },
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
    });

  getHistorialByID = (id) =>
    api.get(
      `detalle_historial_movimiento/${id}/`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
}

export default new HistorialMServices();
