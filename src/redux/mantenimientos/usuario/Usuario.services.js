import api from "../../../services/axios.services";

class UsuarioServices {
  getUser = (params) =>
    api.get(
      "users/",
      {
        headers: { "Content-Type": "application/json" },
        params: params,
      }
    );

  getUserByID = (id) =>
    api.get(
      `users/${id}/`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

  saveUser = (data) =>
    api.post(
      "users/",
      data,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

  editUser = (id, data) =>
    api.put(
      `users/${id}/`,
      data,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

  deleteUser = (id) =>
    api.delete(
      `users/${id}/`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
}

export default new UsuarioServices();
