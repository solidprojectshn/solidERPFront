import api from "services/axios.services";

class BuscadorSerieServices {
    getBuscadorSeries = (params) =>
        api.get("buscador_serie/", {
            params : params,
            headers : { "Content-Type" : "application/json"},
        });
}

export default new BuscadorSerieServices();