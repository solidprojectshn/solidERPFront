import api from "../../../services/axios.services";

class MetaServices{
    getMeta = (params) =>
        api.get(
            "meta_producto/",
            {
                headers:{"Content-Type": "application/json"},
                params:params,
            }
        );
    saveMeta = (data) =>
        api.post(
            "meta_producto/",
        data,
        {
            headers: { "Content-Type": "application/json" },
        }
        );
    editMeta = (id, data) =>
        api.put(
          `meta_producto/${id}/`,
          data,
          {
            headers: { "Content-Type": "application/json" },
          }
        ); 
    deleteMeta = (id) =>
        api.delete(
            `meta_producto/${id}/`,
            {
            headers: { "Content-Type": "application/json" },
            }
        );
}

export default new MetaServices();