import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../store/slices/categorySlice";
import { selectSubcategories } from "../../store/selectors/categoriesSelectors";
import { RootState, AppDispatch } from "../../store";
import s from "./CategoriesSection.module.css";
import { Layout } from "../Layout/Layout";
import { Link } from "react-router";

interface CategoriesSectionProps {
  parentId: number;
  reverse?: boolean;
  children: React.ReactNode;
}

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  parentId,
  reverse = false,
  children,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const { categories, loading, error } = useSelector(
    (state: RootState) => state.categories
  );

  const subcategories = useSelector((state: RootState) =>
    selectSubcategories(parentId)(state)
  );

  console.log(categories);

  console.log(subcategories);

  const parentSlug = categories.find((item) => item.id === parentId)?.slug;

  console.log(parentSlug);

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  if (loading) {
    return <p>Завантаження категорій...</p>;
  }

  if (error) {
    return <p>Помилка: {error}</p>;
  }

  return (
    <Layout>
      <div className={s.titleContainer}>
        <span className={s.stub}>stuuuuuuuuuuuuuuuuuuuuub</span>
        {children}
        <Link to={`/catalog/${parentSlug}`}>
          <span>Перейти до категорії</span>
          <svg
            viewBox="0 0 25 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_1195_3453)">
              <path d="M17.9177 5.5L16.8487 6.55572L21.6059 11.2535H0.5V12.7465H21.6059L16.8487 17.4443L17.9177 18.5L24.5 12L17.9177 5.5Z" />
            </g>
            <defs>
              <clipPath id="clip0_1195_3453">
                <rect
                  width="24"
                  height="24"
                  fill="white"
                  transform="translate(0.5 0.5)"
                />
              </clipPath>
            </defs>
          </svg>
        </Link>
      </div>

      {subcategories.length === 0 ? (
        <p>Немає підкатегорій для цієї категорії.</p>
      ) : (
        <ul className={s.categoriesList}>
          {!reverse && (
            <li className={s.large} key={subcategories[0].id}>
              <Link to="/sdgfsdg">
                <p>{subcategories[0].name}</p>
                <img src={subcategories[0].image?.src} alt="" />

                <div className={s.linkHover}>
                  <span>Перейти</span>
                  <svg
                    className={s.arrow}
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9.3335 9.33334L22.6668 22.6667M22.6668 22.6667V9.33334M22.6668 22.6667H9.3335"
                      stroke="#D63D44"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  <svg
                    className={s.circle}
                    viewBox="0 0 181 64"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M174.659 12.9972C160.427 7.54232 122.41 -2.2764 84.1883 2.08748C45.967 6.45135 27.6018 12.9972 23.1969 15.7247C12.0152 21.1795 -7.29876 34.9985 4.89951 46.6355C20.1473 61.1817 51.6594 63 96.3863 63C124.703 63 150.219 56.1674 165.175 50.613C171.577 48.2355 178.669 44.6659 179.838 37.9378C181.58 27.919 169.827 15.1837 116.717 10.2699"
                      stroke="#D63D44"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </Link>
            </li>
          )}

          <div className={s.subcategoriesContainer}>
            {subcategories.slice(1).map((sub) => (
              <li key={sub.id}>
                <Link to={`catalog/${parentSlug}/${sub.slug}`}>
                  <p>{sub.name}</p>
                  {sub.image?.src && <img src={sub.image.src} alt="" />}
                  <div className={s.linkHover}>
                    <span>Перейти</span>
                    <svg
                      className={s.arrow}
                      viewBox="0 0 32 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9.3335 9.33334L22.6668 22.6667M22.6668 22.6667V9.33334M22.6668 22.6667H9.3335"
                        stroke="#D63D44"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>

                    <svg
                      className={s.circle}
                      viewBox="0 0 181 64"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M174.659 12.9972C160.427 7.54232 122.41 -2.2764 84.1883 2.08748C45.967 6.45135 27.6018 12.9972 23.1969 15.7247C12.0152 21.1795 -7.29876 34.9985 4.89951 46.6355C20.1473 61.1817 51.6594 63 96.3863 63C124.703 63 150.219 56.1674 165.175 50.613C171.577 48.2355 178.669 44.6659 179.838 37.9378C181.58 27.919 169.827 15.1837 116.717 10.2699"
                        stroke="#D63D44"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </Link>
              </li>
            ))}
          </div>

          {reverse && (
            <li className={s.large} key={subcategories[0].id}>
              <Link to={`/catalog/${parentSlug}/${subcategories[0].slug}`}>
                <p>{subcategories[0].name}</p>
                <img src={subcategories[0].image?.src} alt="" />
                <div className={s.linkHover}>
                  <span>Перейти</span>
                  <svg
                    className={s.arrow}
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9.3335 9.33334L22.6668 22.6667M22.6668 22.6667V9.33334M22.6668 22.6667H9.3335"
                      stroke="#D63D44"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  <svg
                    className={s.circle}
                    viewBox="0 0 181 64"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M174.659 12.9972C160.427 7.54232 122.41 -2.2764 84.1883 2.08748C45.967 6.45135 27.6018 12.9972 23.1969 15.7247C12.0152 21.1795 -7.29876 34.9985 4.89951 46.6355C20.1473 61.1817 51.6594 63 96.3863 63C124.703 63 150.219 56.1674 165.175 50.613C171.577 48.2355 178.669 44.6659 179.838 37.9378C181.58 27.919 169.827 15.1837 116.717 10.2699"
                      stroke="#D63D44"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </Link>
            </li>
          )}
        </ul>
      )}
    </Layout>
  );
};
