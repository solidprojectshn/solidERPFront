import api from "../../../services/axios.services";

class DenominacionServices {
  getDenominacion = (params) =>
    api.get(
      "denominacion/",
      {
        headers: { "Content-Type": "application/json" },
        params: params,
      }
    );

  getDenominacionByID = (id) =>
    api.get(
      `denominacion/${id}/`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

  saveDenominacion = (data) =>
    api.post(
      "denominacion/",
      data,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

  editDenominacion = (id, data) =>
    api.put(
      `denominacion/${id}/`,
      data,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

  deleteDenominacion = (id) =>
    api.delete(
      `denominacion/${id}/`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
}

export default new DenominacionServices();
