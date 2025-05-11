import { useEffect, useState } from "react";
import {
  fetchCartProducts,
  fetchProductById,
  fetchProductVariations,
} from "../../store/slices/productsSlice";
import { ProductSlider } from "../../components/ProductSlider/ProductSlider";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { Layout } from "../../components/Layout/Layout";
import s from "./ProductPage.module.css";
import { ProductContent } from "../../components/ProductContent/ProductContent";
import { ReviewsList } from "../../components/ReviewsList/ReviewsList";
import { ProductList } from "../../components/ProductList/ProductList";
import { Breadcrumbs } from "@mui/material";
import { usePageData } from "../../hooks/usePageData";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { ProductInfo } from "../../types/productTypes";

interface HeaderProps {
  openRegister: () => void;
  openReview: () => void;
  openCart: () => void;
}

const ProductPage: React.FC<HeaderProps> = ({
  openRegister,
  openReview,
  openCart,
}) => {
  const dispatch = useAppDispatch();
  const { currentProduct, reviews, variations } = useSelector(
    (state: any) => state.products
  );

  const [related, setRelated] = useState<ProductInfo[]>([]);

  useEffect(() => {
    if (
      currentProduct &&
      Array.isArray(currentProduct.related_ids) &&
      currentProduct.related_ids.length > 0
    ) {
      dispatch(fetchCartProducts(currentProduct.related_ids)).then((res) => {
        if (fetchCartProducts.fulfilled.match(res)) {
          setRelated(res.payload);
        }
      });
    } else {
      setRelated([]);
    }
  }, [currentProduct, dispatch]);

  const { t } = useTranslation();

  const { id } = useParams();

  const currentReviews = reviews.filter(
    (item: { product_id: any }) => item.product_id == id
  );

  useEffect(() => {
    if (id) {
      const productIdNumber = parseInt(id, 10);
      dispatch(fetchProductById(productIdNumber));
      dispatch(fetchProductVariations(+id));
    }
  }, [dispatch, id]);

  const productImages = currentProduct?.images?.map((img: any) => img.src);

  const categories = currentProduct?.categories || [];
  const breadcrumbs = [
    { name: t("breadCrumbs.main"), link: "/" },
    ...(categories.length > 0
      ? [
          {
            name: categories[0]?.name || "",
            link: `/catalog/${categories[0]?.slug}`,
          },
        ]
      : []),
    ...(categories.length > 1
      ? [
          {
            name: categories[1]?.name || "",
            link: `/catalog/${categories[0]?.slug}/${categories[1]?.slug}`,
          },
        ]
      : []),
    {
      name: currentProduct?.name || "",
      link: `/product/${currentProduct?.slug}/${currentProduct?.id}`,
    },
  ];

  const seoData = usePageData(currentProduct?.permalink || null);

  return (
    <>
      {!currentProduct ? (
        <div className={s.loader}></div>
      ) : (
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
              <meta
                property="og:description"
                content={seoData.og_description}
              />
            )}
            {seoData.og_url && (
              <meta property="og:url" content={seoData.og_url} />
            )}
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

          <Layout className={s.contentFlex}>
            <ProductSlider images={productImages} info={currentProduct} />
            <ProductContent
              openRegister={openRegister}
              info={currentProduct}
              variations={variations}
              reviewsQty={currentReviews.length}
              openCart={openCart}
            />
          </Layout>

          <Layout>
            <ProductList
              centered={true}
              categories={[currentProduct.categories[0]?.id || "Новинки"]}
              defaultCategory={currentProduct.categories[0]?.id || "Новинки"}
            >
              <h2>
                <span>{t("product.similarProductsTitle1")}</span>
                <span>{t("product.similarProductsTitle2")}</span>
              </h2>
            </ProductList>

            {currentProduct.related_ids.length > 0 && (
              <ProductList buyWith={true} products={related} centered={true}>
                <h2>
                  <span>{t("product.buyWithProductsTitle1")}</span>
                  <span>{t("product.buyWithProductsTitle2")}</span>
                </h2>
              </ProductList>
            )}
          </Layout>

          <Layout>
            <ReviewsList openReview={openReview} reviews={currentReviews} />
          </Layout>
        </main>
      )}
    </>
  );
};

export default ProductPage;
