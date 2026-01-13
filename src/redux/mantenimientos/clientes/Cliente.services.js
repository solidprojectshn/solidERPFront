import api from "../../../services/axios.services";

class ClienteServices {
  getCliente = (params) =>
    api.get(
      "cliente/",
      {
        headers: { "Content-Type": "application/json" },
        params: params,
      }
    );

  getClienteByID = (id) =>
    api.get(
      `cliente/${id}/`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

  saveCliente = (data) =>
    api.post(
      "cliente/",
      data,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

  editCliente = (id, data) =>
    api.put(
      `cliente/${id}/`,
      data,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

  deleteCliente = (id) =>
    api.delete(
      `cliente/${id}/`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
}

export default new ClienteServices();
