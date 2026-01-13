import api from "../../../services/axios.services";

class LocalServices {
  getLocal = (params) =>
    api.get(
      "local/",
      {
        headers: { "Content-Type": "application/json" },
        params: params,
      }
    );

  getLocalByID = (id) =>
    api.get(
      `local/${id}/`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

  saveLocal = (data) =>
    api.post(
      "local/",
      data,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

  editLocal = (id, data) =>
    api.put(
      `local/${id}/`,
      data,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

  deleteLocal = (id) =>
    api.delete(
      `local/${id}/`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
}

export default new LocalServices();
