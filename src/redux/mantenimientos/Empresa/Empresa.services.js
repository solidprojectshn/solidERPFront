import api from "../../../services/axios.services";

class EmpresaServices {
  getInfoEmpresa = (params) =>
    api.get(
      "infoEmpresa/",
      {
        headers: { "Content-Type": "application/json" },
        params: params,
      }
    );

  getInfoEmpresaByID = (id) =>
    api.get(
      `infoEmpresa/${id}/`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

  saveInfoEmpresa = (data) =>
    api.post(
      "infoEmpresa/",
      data,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

  editInfoEmpresa = (id, data) =>
    api.put(
      `infoEmpresa/${id}/`,
      data,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

  deleteInfoEmpresa = (id) =>
    api.delete(
      `infoEmpresa/${id}/`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
}

export default new EmpresaServices();
