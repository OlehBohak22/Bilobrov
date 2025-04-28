import React, { useState, useEffect } from "react";
import "./ProductSlider.css";
import s from "./ProductSlider.module.css";
import { ProductInfo } from "../../types/productTypes";

interface ProductSliderProps {
  images: string[]; // масив з URL-адрес зображень
  info: ProductInfo;
}

export const ProductSlider: React.FC<ProductSliderProps> = ({
  images,
  info,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [displayImages, setDisplayImages] = useState<string[]>([]);

  const MAX_IMAGES = 6;

  useEffect(() => {
    if (images && images.length > 0) {
      let newImages = [...images];

      if (newImages.length > MAX_IMAGES) {
        newImages = newImages.slice(0, MAX_IMAGES);
      }

      setDisplayImages(newImages);
      setCurrentIndex(0);
    }
  }, [images]);

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

  const isNewProduct = (dateCreated: string) => {
    if (!dateCreated) return false;

    const createdDate = new Date(dateCreated);
    const today = new Date();

    const daysDiff = Math.floor(
      (today.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    return daysDiff <= 14;
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

        {displayImages.map((img, index) => (
          <img
            key={img}
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
        <div className={s.markersBlock}>
          {info.featured && (
            <div className={s.bestMarker}>
              <span>bilobrov'S</span>
              <span>BEST</span>
            </div>
          )}

          <div className={s.topMarker}>TOP</div>

          {isNewProduct(info.date_created) && (
            <div className={s.newMarker}>NEW</div>
          )}

          {info.sale_price &&
            info.sale_price !== "0" &&
            info.regular_price &&
            info.regular_price !== "0" && (
              <div className={s.saleMarker}>
                -
                {Math.round(
                  (1 - Number(info.sale_price) / Number(info.regular_price)) *
                    100
                )}
                %
              </div>
            )}
        </div>

        <img
          src={displayImages[currentIndex]}
          alt={`Slide ${currentIndex + 1}`}
          className="slider-image"
        />
      </div>
    </div>
  );
};
