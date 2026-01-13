import React, { useState } from "react";
import './home.css';
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

// Importación de imágenes locales
import img1 from "../../../assets/images/CarruselImg1.png";
import img2 from "../../../assets/images/CarruselImg2.png";
import img3 from "../../../assets/images/CarruselImg3.png";

const images = [
  { url: img1, name: "AZUMI V51", description: "Pantalla: 5 ’,Cámara: 8mpx/ frontal 2mpx, Android: 10 Go Edition, RAM: 1GB /32GB interno, WIFI/LTE" },
  { url: img2, name: "AZUMI L4Z", description: "Pantalla: 1.8’, Cámara: VGA + Flash, Sistema Android, RAM: 32MB /32MB interno"},
  { url: img3, name: "PCD P50", description: "Pantalla: 5 ’, Cámara: 5mpx/ frontal 2mpx, Android: 11 Go Edition, RAM: 1GB /32GB interno, WIFI/LTE" },
];

const Slider = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
  
    const nextSlide = () => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };
  
    const prevSlide = () => {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? images.length - 1 : prevIndex - 1
      );
    };
  
    return (
      <div className="container">
        <div
          className="slide"
          style={{
            backgroundImage: `url(${images[currentIndex].url})`,
            height: '400px', // Ajusta la altura del slider
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems:'center',
            justifyContent:'left',
          }}
        >

          <div className="content" style={{margin:'5%'}}>
            <div className="name">{images[currentIndex].name}</div>
            <div className="des">{images[currentIndex].description}</div>
          </div>

        </div>

        <div className="button">
          <button className="prev" onClick={prevSlide}>
            <ArrowBackIosIcon />
          </button>
          <button className="next" onClick={nextSlide}>
            <ArrowForwardIosIcon />
          </button>
        </div>
      </div>
    );
};

export default Slider;
