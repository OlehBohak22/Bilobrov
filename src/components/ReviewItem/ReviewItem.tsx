import { useWindowSize } from "../../hooks/useWindowSize";
import { StarRating } from "../StarRating/StarRating";
import s from "./ReviewItem.module.css";
import { FC } from "react";

interface ReviewItemPropType {
  reviewerName: string;
  reviewerRating: number;
  review: string;
  images: string[];
  date: string;
}

export const ReviewItem: FC<ReviewItemPropType> = ({
  reviewerName,
  reviewerRating,
  review,
  images = [],
  date,
}) => {
  const filteredImages = Array.isArray(images)
    ? images.filter((image) => image.trim() !== "")
    : [];

  const { width } = useWindowSize();
  const isMobile = width < 1024;

  return (
    <li className={s.item}>
      <p className={s.reviewerName}>{reviewerName || "Користувач"}</p>

      <div className={s.reviewerContent}>
        <div className={s.dateHeading}>
          <StarRating isMobile={isMobile} rating={reviewerRating} />
          <p className={s.date}>{date}</p>
        </div>

        {filteredImages.length > 0 && (
          <ul className={s.iamgeList}>
            {filteredImages.map((image, index) => (
              <li key={index}>
                <img src={image} alt={`Review image ${index + 1}`} />
              </li>
            ))}
          </ul>
        )}

        <p
          className={s.review}
          dangerouslySetInnerHTML={{ __html: review }}
        ></p>
      </div>
    </li>
  );
};
