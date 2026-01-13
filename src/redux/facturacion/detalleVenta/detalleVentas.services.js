import api from "../../../services/axios.services";

class DetalleVentasServices {

  getDetalleVentas = (params) =>
    api.get(
      "detalle_venta/",
      {
        headers: { "Content-Type": "application/json" },
        params: params,
      }
    );

}

export default new DetalleVentasServices();
