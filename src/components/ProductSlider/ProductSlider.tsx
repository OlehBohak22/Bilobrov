import React, { useState } from "react";
import "./ProductSlider.css";

interface ProductSliderProps {
  images: string[]; // масив з URL-адрес зображень
}

export const ProductSlider: React.FC<ProductSliderProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Перевірка на випадок порожнього масиву images
  if (!images || images.length === 0) {
    return <div>No images available</div>; // Якщо немає зображень, вивести відповідне повідомлення
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const selectSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="slider">
      <div className="slider-thumbnails">
        <button className="custom-left-nav" onClick={prevSlide}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 15.5L12 8.5L5 15.5"
              stroke="#212121"
              strokeWidth="1.6"
              strokeLinecap="square"
            />
          </svg>
        </button>

        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Thumbnail ${index + 1}`}
            className={`thumbnail ${index === currentIndex ? "active" : ""}`}
            onClick={() => selectSlide(index)}
          />
        ))}
        <button className="custom-right-nav" onClick={nextSlide}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 8.5L12 15.5L5 8.5"
              stroke="#212121"
              strokeWidth="1.6"
              strokeLinecap="square"
            />
          </svg>
        </button>
      </div>
      <div className="slider-main">
        <img
          src={images[currentIndex]}
          alt={`Slide ${currentIndex + 1}`}
          className="slider-image"
        />
      </div>
    </div>
  );
};
