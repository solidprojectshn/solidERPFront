import api from "../../../services/axios.services";

class QZServices {
  // Certificado público (.txt)
  getCertRoute = () =>
    api.get("qz/cert/", {
      headers: { "Content-Type": "text/plain" },
      cache: "no-store",
    });

  // Firma del contenido (vía GET con query param)
  signData = (toSign) =>
    api.get("qz/sign/", {
      params: {
        request: toSign,
        t: new Date().getTime(), // para evitar caché
      },
      headers: {
        "Content-Type": "text/plain",
      },
    });

}

const qzServices = new QZServices();
export default qzServices;

