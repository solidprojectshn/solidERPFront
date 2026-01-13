import api from "../../../services/axios.services";

class MetodoPagoServices {
  getMetodoPago = (params) =>
    api.get(
      "/metodoPago",
      {
        headers: { "Content-Type": "application/json" },
        params: params,
      }
    );

  getMetodoPagoByID = (id) =>
    api.get(
      `metodoPago/${id}/`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

  saveMetodoPago = (data) =>
    api.post(
      "metodoPago/",
      data,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

  editMetodoPago = (id, data) =>
    api.put(
      `metodoPago/${id}/`,
      data,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

  deleteMetodoPago = (id) =>
    api.delete(
      `tipoProducto/${id}/`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
}

export default new MetodoPagoServices();
