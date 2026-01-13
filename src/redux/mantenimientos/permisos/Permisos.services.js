import api from "../../../services/axios.services";

class PermisosServices {
  getPermisosSistema = (params) =>
    api.get(
      "permissions/",
      {
        headers: { "Content-Type": "application/json" },
        params: params,
      }
    );

  getPermisosByID = (id) =>
    api.get(
      `grupos_permisos/${id}/`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

  savePermisos = (data) =>
    api.post(
      "grupos_permisos/",
      data,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

  editPermisos = (id, data) =>
    api.put(
      `grupos_permisos/${id}/`,
      data,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

  deletePermisos = (id) =>
    api.delete(
      `grupos_permisos/${id}/`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
}

export default new PermisosServices();
