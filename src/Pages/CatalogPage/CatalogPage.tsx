// CatalogPage.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
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
  resetPage,
  setPage,
} from "../../store/slices/filterSlice";

import { ProductItem } from "../../components/ProductItem/ProductItem";
import { Filters } from "../../components/FilterPopup/FilterPopup";
import s from "./CatalogPage.module.css";
import { Layout } from "../../components/Layout/Layout";
import { Breadcrumbs } from "@mui/material";
import { CustomSortDropdown } from "../../components/DropDown/DropDown";
import { Category } from "../../types/categoryType";
import { Pagination } from "../../components/Pagination/Pagination";
import { AnimatePresence } from "framer-motion";
import { useWindowSize } from "../../hooks/useWindowSize";
import { Loader } from "../../components/Loader/Loader";
import { usePageData } from "../../hooks/usePageData";
import { Helmet } from "react-helmet";
import { API_URL } from "../../constants/api";
import { useTranslation } from "react-i18next";

export const CatalogPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const productsRef = useRef<HTMLUListElement | null>(null);
  const { t } = useTranslation();
  const location = useLocation();
  const query = new URLSearchParams(location.search);

  const {
    products,
    loading,
    sort,
    selectedCategories,
    allCategories,
    totalCount,
    page,
  } = useSelector((state: RootState) => ({
    products: state.filters.products,
    loading: state.filters.loading,
    sort: state.filters.sort,
    selectedCategories: state.filters.selectedCategories,
    selectedBrands: state.filters.selectedBrands,
    allCategories: state.categories.categories,
    hasMore: state.filters.hasMore,
    page: state.filters.page,
    totalCount: state.filters.totalCount,
  }));

  const { width } = useWindowSize();

  const isMobile = width < 1024;

  const totalPages = Math.ceil(totalCount / 20);

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

  const onTabClick = (
    categoryId: number,
    categorySlug: string,
    categoryUrl: string
  ) => {
    const clickedCategory = allCategories.find((cat) => cat.id === categoryId);
    let fullSlugPath = `/catalog/${categorySlug}`;

    if (clickedCategory?.parent) {
      const parentCat = allCategories.find(
        (cat) => cat.id === clickedCategory.parent
      );
      if (parentCat) {
        fullSlugPath = `/catalog/${parentCat.slug}/${clickedCategory.slug}`;
      }
    }

    const currentParams = new URLSearchParams(location.search);
    currentParams.set("categories", categoryId.toString());

    navigate(
      {
        pathname: fullSlugPath,
        search: currentParams.toString(),
      },
      { state: categoryUrl } // залишаємо для meta
    );
  };

  useEffect(() => {
    if (isFilterOpen) {
      dispatch(setMinPrice(Number(query.get("min")) || 0));
      dispatch(setMaxPrice(Number(query.get("max")) || 10000));
    }
  }, [isFilterOpen]);

  // useEffect(() => {
  //   if (slug === "news" || slug === "sales") {
  //     dispatch(resetFilters());

  //     navigate(`/catalog/${slug}`, { replace: true });
  //   }
  // }, [slug]);

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
      if (!sortFromQuery) {
        dispatch(setSort("date"));
      } else if (validSortValues.includes(sortFromQuery as any)) {
        dispatch(setSort(sortFromQuery as (typeof validSortValues)[number]));
      }
    } else if (validSortValues.includes(sortFromQuery as any)) {
      dispatch(setSort(sortFromQuery as (typeof validSortValues)[number]));
    } else {
      dispatch(setSort("popularity"));
    }

    dispatch(fetchProducts());

    dispatch(resetPage());
  }, [slug, parentSlug, childSlug, allCategories, location.search]);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [page]);

  const brands = useSelector((state: RootState) => state.brands);

  const pageTitle = useMemo(() => {
    if (slug === "sales") return t("sales");
    if (slug === "news") return "Новинки";

    const brandId = query.get("brand");

    if (brandId) {
      const brand = brands.items.find((b) => b.id.toString() === brandId);
      if (brand) return brand.name;
    }

    if (selectedCategories.length !== 1) {
      return t("all");
    }

    const selectedCategory = allCategories.find(
      (cat) => cat.id.toString() === selectedCategories[0]
    );

    if (!selectedCategory) return t("all");

    if (selectedCategory.parent !== 0) {
      const parent = allCategories.find(
        (cat) => cat.id === selectedCategory.parent
      );
      return parent?.name || t("all");
    }

    return selectedCategory.name;
  }, [slug, selectedCategories, allCategories, query, brands]);

  const breadcrumbs = useMemo(() => {
    const list = [{ name: t("breadCrumbs.main"), link: "/" }];

    if (!slug) {
      list.push({ name: "Каталог", link: "/catalog" });
    } else if (slug === "sales") {
      list.push({ name: t("sales"), link: "/catalog/sales" });
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

  useEffect(() => {
    const handleScroll = () => {
      const container = document.querySelector(`.${s.scroller}`);
      const scrollbar = document.querySelector(
        `.${s.scrollbar}`
      ) as HTMLElement;

      if (container && scrollbar) {
        const maxScroll = container.scrollWidth - container.clientWidth;

        const rawProgress =
          maxScroll > 0 ? (container.scrollLeft / maxScroll) * 100 : 0;

        const scrollProgress = Math.max(rawProgress, 15);

        scrollbar.style.width = `${scrollProgress}%`;
      }
    };

    const container = document.querySelector(`.${s.scroller}`);
    if (container) {
      container.addEventListener("scroll", handleScroll);
      handleScroll();
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [location]);

  let metaUrl = location.state;

  if (!metaUrl) {
    if (slug === "news") {
      metaUrl = `${API_URL}/product-category/news`;
    } else if (slug === "sales") {
      metaUrl = `${API_URL}/product-category/sales`;
    } else if (parentSlug && childSlug) {
      metaUrl = `${API_URL}/product-category/${parentSlug}/${childSlug}`;
    } else if (parentSlug) {
      metaUrl = `${API_URL}/product-category/${parentSlug}`;
    } else if (slug) {
      metaUrl = `${API_URL}/product-category/${slug}`;
    } else {
      metaUrl = `${API_URL}/product-category`;
    }
  }

  const seoData = usePageData(metaUrl);

  return (
    <main className={s.page}>
      <Helmet>
        <title>{seoData.title || "Bilobrov"}</title>
        <link
          rel="canonical"
          href={seoData.canonical || window.location.href}
        />

        {seoData.og_title && (
          <meta property="og:title" content={seoData.og_title} />
        )}
        {seoData.og_description && (
          <meta property="og:description" content={seoData.og_description} />
        )}
        {seoData.og_url && <meta property="og:url" content={seoData.og_url} />}
        {seoData.og_locale && (
          <meta property="og:locale" content={seoData.og_locale} />
        )}
        {seoData.og_type && (
          <meta property="og:type" content={seoData.og_type} />
        )}
        {seoData.og_site_name && (
          <meta property="og:site_name" content={seoData.og_site_name} />
        )}
        {seoData.twitter_card && (
          <meta name="twitter:card" content={seoData.twitter_card} />
        )}

        <meta
          name="robots"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />
      </Helmet>

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
        <AnimatePresence>
          {isFilterOpen && <Filters onClose={() => setIsFilterOpen(false)} />}
        </AnimatePresence>

        <div className={s.categoryHeader}>
          <h1>{pageTitle}</h1>

          <span>
            {totalCount} {t("catalog.productsLength")}
          </span>
        </div>
      </Layout>
      {selectedCategories.length === 1 &&
        childCategories.length > 0 &&
        isMobile && (
          <div className={s.childCategories}>
            <ul className={s.scroller}>
              {childCategories.map((cat) => (
                <li
                  key={cat.id}
                  className={
                    selectedCategories.includes(cat.id.toString())
                      ? s.active
                      : ""
                  }
                  onClick={() =>
                    onTabClick(cat.id, cat.slug, cat.yoast_head_json.og_url)
                  }
                >
                  {cat.name}
                </li>
              ))}
            </ul>
          </div>
        )}

      {childCategories.length > 0 && isMobile && (
        <Layout>
          <div className={s.scroller}>
            <div className={s.scrollbarContainer}>
              <div className={s.scrollbar}></div>і
            </div>
          </div>
        </Layout>
      )}

      <Layout>
        {selectedCategories.length === 1 &&
          childCategories.length > 0 &&
          !isMobile && (
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
                    onClick={() =>
                      onTabClick(cat.id, cat.slug, cat.yoast_head_json.og_url)
                    }
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
            {t("catalog.filters")}
          </button>
          <div className={s.sort}>
            <CustomSortDropdown sort={sort} />
          </div>
        </div>

        {loading ? (
          <Loader />
        ) : (
          <ul ref={productsRef} className={s.list}>
            {products
              .filter((product) => product && product.slug && product.id)
              .map((product) => (
                <ProductItem key={product.id} info={product} />
              ))}
          </ul>
        )}

        {!loading && totalCount > 20 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(newPage) => {
              dispatch(setPage(newPage));
              dispatch(fetchProducts());

              const catalogTop = document.querySelector(`.${s.list}`);
              catalogTop?.scrollIntoView({
                block: "start",
              });
            }}
          />
        )}
      </Layout>
    </main>
  );
};

export default CatalogPage;
