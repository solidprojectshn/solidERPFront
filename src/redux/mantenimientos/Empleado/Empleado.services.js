import api from "../../../services/axios.services";

class EmpleadoServices {
  getEmpleado = (params) =>
    api.get(
      "empleado/",
      {
        headers: { "Content-Type": "application/json" },
        params: params,
      }
    );

  getEmpleadoByID = (id) =>
    api.get(
      `empleado/${id}/`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

  saveEmpleado = (data) =>
    api.post(
      "empleado/",
      data,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

  editEmpleado = (id, data) =>
    api.put(
      `empleado/${id}/`,
      data,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

  deleteEmpleado = (id) =>
    api.delete(
      `empleado/${id}/`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
}

export default new EmpleadoServices();
