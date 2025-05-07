import React, { useRef, useEffect, useState } from "react";
import s from "./ImageGallery.module.css";
import { ProductInfo } from "../../types/productTypes";
import ReactDOM from "react-dom";

interface Props {
  images: string[];
  info: ProductInfo;
  currentIndex: number;
  onClose: () => void;
  isVisible: boolean;
}

export const ImageGalleryModal: React.FC<Props> = ({
  images,
  info,
  currentIndex = 0,
  onClose,
  isVisible,
}) => {
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);
  const thumbnailsRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(currentIndex);

  const scrollToImage = (index: number) => {
    const el = imageRefs.current[index];
    const container = document.querySelector(`.${s.imageList}`);
    if (el && container) {
      container.scrollTo({
        top: el.offsetTop,
        behavior: "smooth",
      });
    }
  };

  const scrollThumbnails = (direction: "up" | "down") => {
    const newIndex =
      direction === "up"
        ? Math.max(activeIndex - 1, 0)
        : Math.min(activeIndex + 1, images.length - 1);

    setActiveIndex(newIndex);
    scrollToImage(newIndex);
  };

  useEffect(() => {
    scrollToImage(currentIndex);
  }, [currentIndex]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = imageRefs.current.findIndex(
              (el) => el === entry.target
            );
            if (index !== -1) setActiveIndex(index);
          }
        });
      },
      {
        root: document.querySelector(`.${s.imageList}`),
        threshold: 0.6,
      }
    );

    imageRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const brandName = info.brands[0]?.name || "";

  return ReactDOM.createPortal(
    <div className={`${s.overlay} ${isVisible ? s.active : ""}`}>
      <div className={s.modal}>
        <button className={s.closeBtn} onClick={onClose}>
          <svg
            viewBox="0 0 52 52"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M39 13L13 39M13 13L39 39"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>

        <div className={s.header}>
          <h1 className={s.title}>{brandName}</h1>

          <p className={s.productName}>{info.name}</p>

          {typeof info.short_description === "string" ? (
            <p
              className={s.shortDesc}
              dangerouslySetInnerHTML={{ __html: info.short_description }}
            />
          ) : (
            <>{info.short_description}</>
          )}
        </div>

        <div className={s.galleryLayout}>
          <div className={s.thumbnailsWrapper}>
            <button
              className={s.navUp}
              onClick={() => scrollThumbnails("up")}
              disabled={activeIndex === 0}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M19 15.5L12 8.5L5 15.5"
                  stroke="#212121"
                  stroke-width="1.6"
                  stroke-linecap="square"
                />
              </svg>
            </button>

            <div className={s.thumbnails} ref={thumbnailsRef}>
              {images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`thumb-${i}`}
                  className={`${s.thumbnail} ${
                    i === activeIndex ? s.active : ""
                  }`}
                  onClick={() => {
                    setActiveIndex(i);
                    scrollToImage(i);
                  }}
                />
              ))}
            </div>

            <button
              className={s.navDown}
              onClick={() => scrollThumbnails("down")}
              disabled={activeIndex === images.length - 1}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M19 8.5L12 15.5L5 8.5"
                  stroke="#212121"
                  stroke-width="1.6"
                  stroke-linecap="square"
                />
              </svg>
            </button>
          </div>

          <div className={s.imageList}>
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`image-${i}`}
                ref={(el) => {
                  imageRefs.current[i] = el;
                }}
                className={s.mainImage}
              />
            ))}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
