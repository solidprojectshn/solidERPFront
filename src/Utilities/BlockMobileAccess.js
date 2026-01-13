import { useEffect } from "react";

const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

const BlockMobileAccess = () => {
  useEffect(() => {
    if (isMobile) {
      window.location.href = "https://tu-dominio.com/acceso-restringido"; // Cambia la URL a la que desees
    }
  }, []);

  return null;
};

export default BlockMobileAccess;
