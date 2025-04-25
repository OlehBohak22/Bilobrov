import { ReviewItem } from "../ReviewItem/ReviewItem";
import { StarRatingRed } from "../StarRating/StarRating";
import s from "./ReviewsList.module.css";
import { FC, useState } from "react";
import { Pagination } from "../Pagination/Pagination";

interface ReviewerType {
  reviewer: string;
  rating: number;
  review: string;
  review_images: [];
}

interface ReviewsListPropType {
  reviews: ReviewerType[];
  openReview: () => void;
}

const REVIEWS_PER_PAGE = 5;

export const ReviewsList: FC<ReviewsListPropType> = ({
  reviews,
  openReview,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(reviews.length / REVIEWS_PER_PAGE);

  const paginatedReviews = reviews.slice(
    (currentPage - 1) * REVIEWS_PER_PAGE,
    currentPage * REVIEWS_PER_PAGE
  );

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  return (
    <div>
      <div className={s.titleContainer}>
        <div>
          <h2>
            <span>Відгуки</span>
            <span>покупців</span>
          </h2>

          <div className="flex items-center gap-[0.3vw]">
            <StarRatingRed rating={averageRating} />
            <div className={s.qty}>({reviews.length})</div>
          </div>
        </div>

        <button onClick={openReview} className={s.brandLink}>
          <span>Залишити відгук</span>
          <svg
            className={s.arrow}
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 24L24 8M24 8H13.3333M24 8V18.6667"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <div className={s.svg}>
            <svg
              viewBox="0 0 294 72"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M284.287 14.5452C261.072 8.38649 199.054 -2.69916 136.704 2.2278C74.354 7.15475 44.3952 14.5453 37.2095 17.6247C18.9689 23.7834 -12.5376 39.3854 7.36121 52.5239C32.2348 68.9471 83.6398 71 156.602 71C207.79 71 253.366 61.5275 276.109 55.0428C281.579 53.4834 287.256 51.4224 290.662 46.8678C299.376 35.2137 287.483 17.7233 189.767 11.466"
                strokeLinecap="round"
              />
            </svg>

            <svg
              viewBox="0 0 293 70"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M135.911 1.11318C198.355 -3.82198 288.012 8.98884 283.719 13.4511C281.608 15.6446 269.672 13.7519 256.342 11.1326C294.253 21.3178 296.932 36.1688 289.976 45.7142C286.627 50.311 281.011 52.4526 275.541 54.0127C252.767 60.5083 207.114 70 155.84 70C82.7658 70 31.2824 67.9437 6.37091 51.4931C-13.5583 38.3327 17.9963 22.7047 36.2647 16.5357C43.4614 13.4512 73.4659 6.04835 135.911 1.11318Z"
                fill="rgba(214, 61, 68, 1)"
              />
            </svg>
          </div>
        </button>
      </div>

      <ul className={s.list}>
        {paginatedReviews.map((item, index) => (
          <ReviewItem
            key={index}
            reviewerName={item.reviewer}
            reviewerRating={item.rating}
            review={item.review}
            images={item.review_images}
          />
        ))}
      </ul>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};
