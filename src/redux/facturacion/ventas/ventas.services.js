import api from "../../../services/axios.services";

class VentasServices {

  getVentas = (params) =>
    api.get(
      "venta/",
      {
        headers: { "Content-Type": "application/json" },
        params: params,
      }
    );

  getNumFactura = (id) =>
    api.get(
      `rango_factura/siguiente-numero/?local_id=${id}`,
      {
        headers: { "Content-Type": "application/json" }

      }
    );

  getTipoVenta = (params) =>
    api.get(
      "tipo_venta/",
      {
        headers: { "Content-Type": "application/json" },
        params: params,
      }
    );

  getVentaByID = (id) =>
    api.get(
      `detalle_venta/${id}/`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

  saveVenta = (data) =>
    api.post(
      "venta/",
      data,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    savePagoCuota = (data) =>
      api.post(
        "pago_cuota/",
        data,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

}

export default new VentasServices();
