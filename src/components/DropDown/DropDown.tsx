import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./DropDown.module.css";
import { useTranslation } from "react-i18next";

type Props = {
  sort: string;
};

export const CustomSortDropdown: React.FC<Props> = ({ sort }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const options = [
    { value: "popularity", label: t("catalog.popularity") },
    { value: "date", label: t("catalog.date") },
    { value: "price_asc", label: t("catalog.asc") },
    { value: "price_desc", label: t("catalog.desc") },
  ];

  const handleSelect = (selected: string) => {
    const currentParams = new URLSearchParams(location.search);
    if (selected !== "default") {
      currentParams.set("sort", selected);
    } else {
      currentParams.delete("sort");
    }

    navigate({
      pathname: location.pathname,
      search: currentParams.toString(),
    });

    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((o) => o.value === sort);

  return (
    <>
      <div className={styles.dropdownWrapper} ref={dropdownRef}>
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className={styles.dropdownButton}
        >
          {selectedOption?.label || "Сортування"}
          <span
            className={`${styles.dropdownArrow} ${isOpen ? styles.open : ""}`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 9L12 15L18 9"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </button>

        {isOpen && (
          <div className={styles.dropdownList}>
            {options.map((option) => (
              <div
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`${styles.dropdownItem} ${
                  option.value === sort ? styles.selected : ""
                }`}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
