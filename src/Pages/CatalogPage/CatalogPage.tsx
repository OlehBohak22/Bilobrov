import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Layout } from "../../components/Layout/Layout";
import s from "./CatalogPage.module.css";
import { RootState } from "../../store";
import { ProductItem } from "../../components/ProductItem/ProductItem";
import { useEffect } from "react";
import { fetchProducts, setCategories } from "../../store/slices/filterSlice";
import { useAppDispatch } from "../../hooks/useAppDispatch";

export const CatalogPage: React.FC<{
  openFilter?: () => void;
}> = ({ openFilter }) => {
  const { products, loading, categories } = useSelector(
    (state: RootState) => state.filters
  );

  const dispatch = useAppDispatch();
  const { slug } = useParams();

  const allCategories = useSelector(
    (state: RootState) => state.categories.categories
  );

  // Знаходимо поточну категорію
  const category = allCategories.find((cat) => cat.slug === slug);
  const categoryName = category ? category.name : "Всі товари";

  // Знаходимо всі дочірні категорії поточної категорії
  const childCategories = allCategories.filter(
    (cat) => cat.parent === (category ? category.id : null)
  );

  useEffect(() => {
    if (category) {
      const categoryId = category.id.toString();
      if (!categories.includes(categoryId)) {
        dispatch(setCategories([...categories, categoryId]));
        dispatch(fetchProducts());
      }
    }
  }, [category, categories, dispatch]);

  // Функція для додавання дочірньої категорії
  const handleCategoryClick = (childId: string) => {
    if (!categories.includes(childId)) {
      dispatch(setCategories([...categories, childId]));
      dispatch(fetchProducts());
    }
  };

  return (
    <main className={s.page}>
      <Layout>
        <div className={s.categoryHeader}>
          <h1>{categoryName}</h1>
          <span>{products.length} продукти</span>
        </div>

        {/* Відображаємо дочірні категорії */}
        {childCategories.length > 0 && (
          <div className={s.childCategories}>
            <ul>
              {childCategories.map((child) => (
                <li key={child.id}>
                  <button
                    className={
                      categories.includes(child.id.toString()) ? s.active : ""
                    }
                    onClick={() => handleCategoryClick(child.id.toString())}
                  >
                    {child.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className={s.filterController}>
          <button onClick={openFilter}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 12H18M3 6H21M9 18H15"
                stroke="#1A1A1A"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Фільтри
          </button>

          <button>
            За популярністю{" "}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 9L12 15L18 9"
                stroke="#1A1A1A"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {loading ? (
          <p>Завантаження...</p>
        ) : (
          <ul className={s.list}>
            {products.map((item) => (
              <ProductItem key={item.id} info={item} />
            ))}
          </ul>
        )}
      </Layout>
    </main>
  );
};
