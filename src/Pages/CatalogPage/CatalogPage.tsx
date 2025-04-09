// CatalogPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { RootState } from "../../store";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import {
  fetchProducts,
  setSort,
  setSelectedBrands,
  setSelectedCategories,
  setMinPrice,
  setMaxPrice,
  setOnSale,
  setInStock,
  fetchAttributes,
} from "../../store/slices/filterSlice";
import { ProductItem } from "../../components/ProductItem/ProductItem";
import { Filters } from "../../components/FilterPopup/FilterPopup";
import s from "./CatalogPage.module.css";
import { Layout } from "../../components/Layout/Layout";
import { Breadcrumbs } from "@mui/material";
import { CustomSortDropdown } from "../../components/DropDown/DropDown";
import { Category } from "../../types/categoryType";

export const CatalogPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const location = useLocation();
  const query = new URLSearchParams(location.search);

  const {
    products,
    loading,
    sort,
    selectedCategories,
    allCategories,
    attributes,
  } = useSelector((state: RootState) => ({
    products: state.filters.products,
    loading: state.filters.loading,
    sort: state.filters.sort,
    selectedCategories: state.filters.selectedCategories,
    selectedBrands: state.filters.selectedBrands,
    allCategories: state.categories.categories,
    attributes: state.filters.attributes,
  }));

  console.log(attributes);

  const { slug, parentSlug, childSlug } = useParams();

  const activeSlug = childSlug || parentSlug || slug;

  const childCategory = useMemo(() => {
    return allCategories.find(
      (cat) => cat.slug === activeSlug && cat.parent !== 0
    );
  }, [allCategories, activeSlug]);

  const parentCategory = useMemo(() => {
    if (childCategory) {
      return allCategories.find((c) => c.id === childCategory.parent);
    }
    return allCategories.find(
      (cat) => cat.slug === activeSlug && cat.parent === 0
    );
  }, [allCategories, childCategory, activeSlug]);

  const childCategories = useMemo(() => {
    if (!parentCategory) return [];
    return allCategories.filter((cat) => cat.parent === parentCategory.id);
  }, [parentCategory, allCategories]);

  const onTabClick = (categoryId: number, categorySlug: string) => {
    const currentParams = new URLSearchParams(location.search);
    currentParams.set("categories", categoryId.toString());
    navigate({
      pathname: `/catalog/${categorySlug}`,
      search: currentParams.toString(),
    });
  };

  useEffect(() => {
    if (isFilterOpen) {
      // Після відкриття модалки переконайся, що Redux значення актуальні
      dispatch(setMinPrice(Number(query.get("min")) || 0));
      dispatch(setMaxPrice(Number(query.get("max")) || 10000));
    }
  }, [isFilterOpen]);

  useEffect(() => {
    dispatch(fetchAttributes());
    const categoriesFromQuery = query.get("categories");
    const brandsFromQuery = query.get("brand") || query.get("brands");
    const slugs = [childSlug || parentSlug || slug].filter(Boolean);

    if (brandsFromQuery && !categoriesFromQuery && !slug) {
      dispatch(setSelectedCategories([]));
    } else if (categoriesFromQuery) {
      dispatch(setSelectedCategories(categoriesFromQuery.split(",")));
    } else if (slugs.length) {
      const matchedCategories = slugs
        .map((s) => allCategories.find((c) => c.slug === s))
        .filter((c): c is Category => c !== undefined);

      if (matchedCategories.length) {
        dispatch(
          setSelectedCategories(matchedCategories.map((c) => c.id.toString()))
        );
      }
    }

    dispatch(setMinPrice(Number(query.get("min")) || 0));
    dispatch(setMaxPrice(Number(query.get("max")) || 10000));
    dispatch(setInStock(query.get("stock") === "true"));
    dispatch(setSelectedBrands(brandsFromQuery?.split(",") || []));

    if (slug === "sales") {
      dispatch(setOnSale(true));
    } else {
      dispatch(setOnSale(query.get("sale") === "true"));
    }

    const validSortValues = [
      "popularity",
      "date",
      "price_asc",
      "price_desc",
      "rating",
    ] as const;
    const sortFromQuery = query.get("sort");

    if (slug === "news") {
      dispatch(setSort("date"));
    } else if (validSortValues.includes(sortFromQuery as any)) {
      dispatch(setSort(sortFromQuery as (typeof validSortValues)[number]));
    } else {
      dispatch(setSort("popularity"));
    }

    dispatch(fetchProducts());
  }, [slug, parentSlug, childSlug, allCategories, location.search]);

  const pageTitle = useMemo(() => {
    if (slug === "sales") return "Акції";
    if (slug === "news") return "Новинки";

    if (selectedCategories.length !== 1) {
      return "Всі товари";
    }

    const selectedCategory = allCategories.find(
      (cat) => cat.id.toString() === selectedCategories[0]
    );

    if (!selectedCategory) return "Всі товари";

    if (selectedCategory.parent !== 0) {
      const parent = allCategories.find(
        (cat) => cat.id === selectedCategory.parent
      );
      return parent?.name || "Всі товари";
    }

    return selectedCategory.name;
  }, [slug, selectedCategories, allCategories]);

  const breadcrumbs = useMemo(() => {
    const list = [{ name: "Головна", link: "/" }];

    if (!slug) {
      list.push({ name: "Каталог", link: "/catalog" });
    } else if (slug === "sales") {
      list.push({ name: "Акції", link: "/catalog/sales" });
    } else if (slug === "news") {
      list.push({ name: "Новинки", link: "/catalog/news" });
    } else if (parentCategory) {
      list.push({
        name: parentCategory.name,
        link: `/catalog/${parentCategory.slug}`,
      });

      if (childCategory) {
        list.push({
          name: childCategory.name,
          link: `/catalog/${parentCategory.slug}/${childCategory.slug}`,
        });
      }
    }

    return list;
  }, [slug, parentCategory, childCategory]);

  return (
    <main>
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
        {isFilterOpen && <Filters onClose={() => setIsFilterOpen(false)} />}

        <div className={s.categoryHeader}>
          <h1>{pageTitle}</h1>

          <span>{products.length} продукти</span>
        </div>

        {selectedCategories.length === 1 && childCategories.length > 0 && (
          <div className={s.childCategories}>
            <ul>
              {childCategories.map((cat) => (
                <li
                  key={cat.id}
                  className={
                    selectedCategories.includes(cat.id.toString())
                      ? s.active
                      : ""
                  }
                  onClick={() => onTabClick(cat.id, cat.slug)}
                >
                  {cat.name}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className={s.filterController}>
          <button onClick={() => setIsFilterOpen(true)}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 12H18M3 6H21M9 18H15"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Фільтри
          </button>
          <div className={s.sort}>
            <CustomSortDropdown sort={sort} />
          </div>
        </div>

        {loading ? (
          <div className={s.loader}></div>
        ) : (
          <ul className={s.list}>
            {products.map((product) => (
              <ProductItem key={product.id} info={product} />
            ))}
          </ul>
        )}
      </Layout>
    </main>
  );
};
