import React from "react";
import s from "./Pagination.module.css";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const renderPages = () => {
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) pages.push("..");
      pages.push(totalPages);
    }

    return pages.map((page, idx) =>
      typeof page === "number" ? (
        <button
          key={idx}
          className={`${s.pageBtn} ${page === currentPage ? s.active : ""}`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ) : (
        <span key={idx} className={s.dots}>
          {page}
        </span>
      )
    );
  };

  return (
    <div className={s.pagination}>
      <button
        className={s.arrow}
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <svg viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#clip0_3131_27181)">
            <path d="M7.08228 5L8.15132 6.05572L3.39413 10.7535L24.5 10.7535V12.2465L3.39413 12.2465L8.15132 16.9443L7.08228 18L0.5 11.5L7.08228 5Z" />
          </g>
          <defs>
            <clipPath id="clip0_3131_27181">
              <rect
                width="24"
                height="24"
                fill="white"
                transform="matrix(-1 0 0 1 24.5 0)"
              />
            </clipPath>
          </defs>
        </svg>
      </button>
      <div className={s.numbers}>{renderPages()}</div>
      <button
        className={s.arrow}
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <svg viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#clip0_3131_27189)">
            <path d="M17.9177 5L16.8487 6.05572L21.6059 10.7535H0.5V12.2465H21.6059L16.8487 16.9443L17.9177 18L24.5 11.5L17.9177 5Z" />
          </g>
          <defs>
            <clipPath id="clip0_3131_27189">
              <rect
                width="24"
                height="24"
                fill="white"
                transform="translate(0.5)"
              />
            </clipPath>
          </defs>
        </svg>
      </button>
    </div>
  );
};
