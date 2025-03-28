import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Layout } from "../../components/Layout/Layout";
import s from "./CatalogPage.module.css";
import { RootState } from "../../store";
import { ProductItem } from "../../components/ProductItem/ProductItem";
import { useEffect } from "react";
import {
  fetchProducts,
  setBrands,
  setCategories,
} from "../../store/slices/filterSlice";
import { useAppDispatch } from "../../hooks/useAppDispatch";

export const CatalogPage: React.FC<{ openFilter?: () => void }> = ({
  openFilter,
}) => {
  const { products, loading, categories } = useSelector(
    (state: RootState) => state.filters
  );

  const dispatch = useAppDispatch();
  const { slug, parentSlug, childSlug } = useParams();

  console.log(slug, parentSlug, childSlug);

  const allCategories = useSelector(
    (state: RootState) => state.categories.categories
  );

  useEffect(() => {
    dispatch(setCategories([]));
    dispatch(setBrands([]));

    dispatch(fetchProducts({}));
  }, [slug, parentSlug, dispatch]);

  useEffect(() => {
    const filters: { isNew?: boolean; onSale?: boolean } = {};

    if (slug === "news") filters.isNew = true;
    if (slug === "sales") filters.onSale = true;

    // Якщо є parentSlug та childSlug, то обираємо відповідну категорію
    let categoryId = null;
    if (parentSlug && childSlug) {
      const parentCategory = allCategories.find(
        (cat) => cat.slug === parentSlug
      );
      const childCategory = allCategories.find(
        (cat) => cat.slug === childSlug && cat.parent === parentCategory?.id
      );
      if (childCategory) {
        categoryId = childCategory.id.toString();
      }
    } else if (slug) {
      // Якщо тільки slug
      const category = allCategories.find((cat) => cat.slug === slug);
      if (category) categoryId = category.id.toString();
    }

    // Якщо знайдена категорія, додаємо її до фільтрів
    if (categoryId && !categories.includes(categoryId)) {
      dispatch(setCategories([...categories, categoryId]));
    }

    dispatch(fetchProducts(filters));
  }, [slug, parentSlug, childSlug, categories, dispatch, allCategories]);

  const category = allCategories.find(
    (cat) => cat.slug === slug || cat.slug == parentSlug
  );

  const categoryName =
    slug === "news"
      ? "Новинки"
      : slug === "sales"
      ? "Акції"
      : category
      ? category.name
      : "Всі товари";

  const childCategories = allCategories.filter(
    (cat) => cat.parent === (category ? category.id : null)
  );

  console.log(childCategories);

  return (
    <main className={s.page}>
      <Layout>
        <div className={s.categoryHeader}>
          <h1>{categoryName}</h1>
          <span>{products.length} продукти</span>
        </div>

        {childCategories.length > 0 && slug !== "news" && (
          <div className={s.childCategories}>
            <ul>
              {childCategories.map((child) => (
                <li key={child.id}>
                  <button
                    className={
                      categories.includes(child.id.toString()) ? s.active : ""
                    }
                    onClick={() => {
                      const childId = child.id.toString();
                      if (categories.includes(childId)) {
                        // Якщо категорія вже вибрана, знімаємо вибір
                        dispatch(
                          setCategories(
                            categories.filter((id) => id !== childId)
                          )
                        );
                      } else {
                        // Вибираємо тільки одну категорію
                        dispatch(setCategories([childId]));
                      }
                    }}
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
