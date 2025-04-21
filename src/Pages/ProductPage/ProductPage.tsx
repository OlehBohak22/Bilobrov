import { useEffect } from "react";
import {
  fetchProductById,
  fetchProductVariations,
  fetchReviews,
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

interface HeaderProps {
  openRegister: () => void;
  openReview: () => void;
  openCart: () => void;
}

export const ProductPage: React.FC<HeaderProps> = ({
  openRegister,
  openReview,
  openCart,
}) => {
  const dispatch = useAppDispatch();
  const { currentProduct, reviews, variations } = useSelector(
    (state: any) => state.products
  );

  const { id } = useParams();

  const currentReviews = reviews.filter(
    (item: { product_id: any }) => item.product_id == id
  );

  useEffect(() => {
    if (id) {
      const productIdNumber = parseInt(id, 10);
      dispatch(fetchProductById(productIdNumber));
      dispatch(fetchReviews());
      dispatch(fetchProductVariations(+id));
    }
  }, [dispatch, id]);

  const productImages = currentProduct?.images?.map((img: any) => img.src);

  const categories = currentProduct?.categories || [];
  const breadcrumbs = [
    { name: "Головна", link: "/" },
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

  return (
    <>
      {!currentProduct ? (
        <div className={s.loader}></div>
      ) : (
        <main className={s.page}>
          <Layout>
            <Breadcrumbs aria-label="breadcrumb" className="breadcrumbs">
              {breadcrumbs.map((breadcrumb, index) => (
                <Link key={index} to={breadcrumb.link}>
                  {breadcrumb.name}
                </Link>
              ))}
            </Breadcrumbs>
          </Layout>
          <Layout className="flex gap-[5vw]">
            <ProductSlider images={productImages} info={currentProduct} />
            <ProductContent
              openRegister={openRegister}
              info={currentProduct}
              variations={variations}
              reviewsQty={currentReviews.length}
              openCart={openCart}
            />
          </Layout>

          <ProductList
            categories={[currentProduct.categories[0]?.id || "Новинки"]}
            defaultCategory={currentProduct.categories[0]?.id || "Новинки"}
          >
            <h2>
              <span>Схожі</span>
              <span>товари</span>
            </h2>
          </ProductList>

          <Layout>
            <ReviewsList openReview={openReview} reviews={currentReviews} />
          </Layout>
        </main>
      )}
    </>
  );
};
