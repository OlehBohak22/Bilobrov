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

  // Отримуємо дані з Redux
  const { categories, loading, error } = useSelector(
    (state: RootState) => state.categories
  );

  // Фільтруємо підкатегорії за допомогою мемоізованого селектора
  const subcategories = useSelector((state: RootState) =>
    selectSubcategories(parentId)(state)
  );

  useEffect(() => {
    // Якщо категорії ще не завантажено, викликаємо fetchCategories
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
        <Link to="/">
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
              <Link to="/">
                <p>{subcategories[0].name}</p>
                <img src={subcategories[0].image.src} alt="" />
              </Link>
            </li>
          )}

          <div className={s.subcategoriesContainer}>
            {subcategories.slice(1).map((sub) => (
              <li key={sub.id}>
                <Link to="/">
                  <p>{sub.name}</p>
                  <img src={sub.image.src} alt="" />
                </Link>
              </li>
            ))}
          </div>

          {reverse && (
            <li className={s.large} key={subcategories[0].id}>
              <Link to="/">
                <p>{subcategories[0].name}</p>
                <img src={subcategories[0].image.src} alt="" />
              </Link>
            </li>
          )}
        </ul>
      )}
    </Layout>
  );
};
