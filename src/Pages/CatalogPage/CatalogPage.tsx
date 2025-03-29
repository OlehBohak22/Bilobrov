import { useEffect, useMemo, useCallback, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { useSelector, shallowEqual } from "react-redux";
import { Layout } from "../../components/Layout/Layout";
import s from "./CatalogPage.module.css";
import { RootState } from "../../store";
import { ProductItem } from "../../components/ProductItem/ProductItem";
import {
  fetchProducts,
  setBrands,
  setCategories,
  setOnSale,
} from "../../store/slices/filterSlice";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useNavigate } from "react-router-dom";
import { Filters } from "../../components/FilterPopup/FilterPopup";
import { Breadcrumbs } from "@mui/material";

export const CatalogPage = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const dispatch = useAppDispatch();
  const { slug, parentSlug, childSlug } = useParams();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  // Отримуємо параметр бренду з query
  const brand = queryParams.get("brand");

  const selectedBrands = useSelector(
    (state: RootState) => state.filters.brands
  );

  const { products, loading, categories } = useSelector(
    (state: RootState) => state.filters,
    shallowEqual
  );

  const allCategories = useSelector(
    (state: RootState) => state.categories.categories,
    shallowEqual
  );

  useEffect(() => {
    dispatch(setBrands([]));
  }, [childSlug, dispatch]);

  useEffect(() => {
    if (categories.length > 0) {
      dispatch(fetchProducts({ categories })); // ✅ Робимо новий запит тільки якщо є категорії
    }
  }, [categories, dispatch]);

  useEffect(() => {
    if (slug === "news") {
      dispatch(fetchProducts({ isNew: true }));
      dispatch(setOnSale(false));
    } else if (slug === "sales") {
      dispatch(setOnSale(true));
      dispatch(fetchProducts({ onSale: true }));
    } else {
      let categoryId = null;
      if (parentSlug && childSlug) {
        const parentCategory = allCategories.find(
          (cat) => cat.slug === parentSlug
        );
        const childCategory = allCategories.find(
          (cat) => cat.slug === childSlug && cat.parent === parentCategory?.id
        );
        categoryId = childCategory?.id?.toString() || null;
      } else if (slug) {
        categoryId =
          allCategories.find((cat) => cat.slug === slug)?.id?.toString() ||
          null;
      }

      if (categoryId && categories[0] !== categoryId) {
        console.log("Оновлюємо категорію з URL:", categoryId);
        dispatch(setCategories([categoryId]));
      }
    }
  }, [slug, parentSlug, childSlug, dispatch, allCategories, categories]);

  const category = useMemo(
    () =>
      allCategories.find((cat) => cat.slug === slug || cat.slug === parentSlug),
    [slug, parentSlug, allCategories]
  );

  const categoryName = useMemo(
    () =>
      slug === "news"
        ? "Новинки"
        : slug === "sales"
        ? "Акції"
        : category
        ? category.name
        : "Всі товари",
    [slug, category]
  );

  const childCategories = useMemo(
    () =>
      allCategories.filter(
        (cat) => cat.parent === (category ? category.id : null)
      ),
    [category, allCategories]
  );

  const navigate = useNavigate();

  const handleCategoryClick = useCallback(
    (childId: string, childSlug: string) => {
      const newParentSlug = parentSlug || slug; // Якщо parentSlug немає, використовуємо slug як parent
      navigate(`/catalog/${newParentSlug}/${childSlug}`); // ✅ Коректно оновлюємо URL

      if (categories[0] !== childId) {
        dispatch(setCategories([childId]));
        dispatch(fetchProducts({ categories: [childId] }));
      }
    },
    [dispatch, categories, navigate, parentSlug, slug]
  );

  useEffect(() => {
    if (brand && !selectedBrands.includes(brand)) {
      dispatch(setBrands([brand]));
      dispatch(setCategories([]));
      dispatch(fetchProducts({}));
    }
  }, [brand, dispatch, selectedBrands]);

  const breadcrumbs = [
    { name: "Головна", link: "/" },
    { name: categoryName, link: `/catalog/${parentSlug || slug}` },
  ];

  if (childSlug) {
    const childCategory = allCategories.find(
      (cat) => cat.slug === childSlug && cat.parent === category?.id
    );
    const childCategoryName = childCategory ? childCategory.name : "Категорія";

    breadcrumbs.push({
      name: childCategoryName,
      link: `/catalog/${parentSlug || slug}/${childSlug}`,
    });
  }

  return (
    <main className={s.page}>
      {isFilterOpen && <Filters onClose={() => setIsFilterOpen(false)} />}

      <Layout>
        <Breadcrumbs aria-label="breadcrumb" className="breadcrumbs">
          {breadcrumbs.map((breadcrumb, index) => (
            <Link key={index} to={breadcrumb.link}>
              {breadcrumb.name}
            </Link>
          ))}
        </Breadcrumbs>
      </Layout>

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
                    onClick={() =>
                      handleCategoryClick(child.id.toString(), child.slug)
                    }
                  >
                    {child.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className={s.filterController}>
          <button onClick={() => setIsFilterOpen(true)}>
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
          <div className={s.loader}></div>
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
