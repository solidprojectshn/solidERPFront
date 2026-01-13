import api from "../../../services/axios.services";

class DashboardServices {
  getVentasMensuales = (params) =>
    api.get(
      "ventas_mes",
      {
        headers: { "Content-Type": "application/json" },
        params: params,
      }
    );

  getCumpMetas = (params) =>
    api.get(
      "venta_metas",
      {
        headers: { "Content-Type": "application/json" },
        params: params,
      }
    );

    getTopProductos = (params) =>
      api.get(
        "top_productos",
        {
          headers: { "Content-Type": "application/json" },
          params: params,
        }
      );
    
      getTopLocales = (params) =>
        api.get(
          "top_locales",
          {
            headers: { "Content-Type": "application/json" },
            params: params,
          }
        );

        getKpis = (params) =>
          api.get(
            "kpi_dashboard",
            {
              headers: { "Content-Type": "application/json" },
              params: params,
            }
          );
}

export default new DashboardServices();
