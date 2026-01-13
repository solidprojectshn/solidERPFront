import api from "../../../services/axios.services";

class RolServices {
  getRol = (params) =>
    api.get(
      "grupo/",
      {
        headers: { "Content-Type": "application/json" },
        params: params,
      }
    );

  getRolByID = (id) =>
    api.get(
      `grupo/${id}/`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

  saveRol = (data) =>
    api.post(
      "grupo/",
      data,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

  editRol = (id, data) =>
    api.put(
      `grupo/${id}/`,
      data,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

  deleteRol = (id) =>
    api.delete(
      `grupo/${id}/`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
}

export default new RolServices();
