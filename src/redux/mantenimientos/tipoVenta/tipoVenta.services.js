import api from "services/axios.services";

class TipoVentaServices {
    getTipoVenta = (params) =>
        api.get(
            "tipo_venta/",
            {
                headers:{ "Content-Type" : "application/json"},
                params : params,
            }
        );

    saveTipoVenta = (data) =>
        api.post(
            "tipo_venta/",
            data,
            {
                headers: {"Content-Type" : "application/json"},
            }
        );
}

export default new TipoVentaServices();