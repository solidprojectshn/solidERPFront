import api from "../../../services/axios.services";

class ProductoServices {
  getProducto = (params) =>
    api.get(
      "producto/",
      {
        headers: { "Content-Type": "application/json" },
        params: params,
      }
    );

  getProductoByID = (id) =>
    api.get(
      `producto/${id}/`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

  saveProducto = (data) =>
    api.post(
      "producto/",
      data,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

  editProducto = (id, data) =>
    api.put(
      `producto/${id}/`,
      data,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

  deleteProducto = (id) =>
    api.delete(
      `producto/${id}/`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
}

export default new ProductoServices();
