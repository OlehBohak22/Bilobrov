import { StarRating } from "../StarRating/StarRating";
import s from "./ReviewItem.module.css";
import { FC } from "react";

interface ReviewItemPropType {
  reviewerName: string;
  reviewerRating: number;
  review: string;
}

export const ReviewItem: FC<ReviewItemPropType> = ({
  reviewerName,
  reviewerRating,
  review,
}) => {
  return (
    <li className={s.item}>
      <p className={s.reviewerName}>{reviewerName || "Користувач"}</p>

      <div className={s.reviewerContent}>
        <div className="mb-[0.8vw]">
          <StarRating rating={reviewerRating.toString()} />
        </div>

        <p dangerouslySetInnerHTML={{ __html: review }}></p>
      </div>
    </li>
  );
};
