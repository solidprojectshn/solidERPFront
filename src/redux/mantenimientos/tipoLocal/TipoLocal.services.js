import api from "../../../services/axios.services";

class TipoLocalServices {
  getTipoLocal = (params) =>
    api.get(
      "tipoLocal/",
      {
        headers: { "Content-Type": "application/json" },
        params: params,
      }
    );

  getTipoLocalByID = (id) =>
    api.get(
      `tipoLocal/${id}/`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

  saveTipoLocal = (data) =>
    api.post(
      "tipoLocal/",
      data,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

  editTipoLocal = (id, data) =>
    api.put(
      `tipoLocal/${id}/`,
      data,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

  deleteTipoLocal = (id) =>
    api.delete(
      `tipoLocal/${id}/`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

}

export default new TipoLocalServices();