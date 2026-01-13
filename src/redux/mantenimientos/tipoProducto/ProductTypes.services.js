import api from "../../../services/axios.services";

class ProductTypeServices {
  getProductType = (params) =>
    api.get(
      "tipoProducto/",
      {
        headers: { "Content-Type": "application/json" },
        params: params,
      }
    );

  getProductTypeByID = (id) =>
    api.get(
      `tipoProducto/${id}/`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

  saveProductType = (data) =>
    api.post(
      "tipoProducto/",
      data,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

  editProductType = (id, data) =>
    api.put(
      `tipoProducto/${id}/`,
      data,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

  deleteProductType = (id) =>
    api.delete(
      `tipoProducto/${id}/`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
}

export default new ProductTypeServices();
