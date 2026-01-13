import api from "../../../services/axios.services";

class RangoFacturaServices {
  getRangoFactura = (params) =>
    api.get(
      "rango_factura/",
      {
        headers: { "Content-Type": "application/json" },
        params: params,
      }
    );

  getRangoFacturaByID = (id) =>
    api.get(
      `rango_factura/${id}/`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

  saveRangoFactura = (data) =>
    api.post(
      "rango_factura/",
      data,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

  editRangoFactura = (id, data) =>
    api.put(
      `rango_factura/${id}/`,
      data,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

  deleteRangoFactura = (id) =>
    api.delete(
      `rango_factura/${id}/`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
}

export default new RangoFacturaServices();
