import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './homecarrusel.css'; 

//imagenes 
import Img1 from '../../../assets/images/CarruselImg1.png';
import Img2 from '../../../assets/images/CarruselImg2.png';
import Img3 from '../../../assets/images/CarruselImg3.png';

const FullScreenCarousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1500,
    arrows: true,
    pauseOnHover: true,
  };

  return (
    <div style={{ width: "100%", height: "100vh", overflow: "hidden" }}>
      <Slider {...settings}>
        <div>
          <img src={Img1} alt="Imagen 1" />
        </div>
        <div>
          <img src={Img2} alt="Imagen 2" />
        </div>
        <div>
          <img src={Img3} alt="Imagen 3" />
        </div>
        {/* Agrega más imágenes según sea necesario */}
      </Slider>
    </div>
  );
};

export default FullScreenCarousel;
