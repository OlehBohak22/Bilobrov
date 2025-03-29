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
}

export const ProductPage: React.FC<HeaderProps> = ({
  openRegister,
  openReview,
}) => {
  const dispatch = useAppDispatch();
  const { currentProduct, reviews, variations } = useSelector(
    (state: any) => state.products
  );

  const { id } = useParams(); // Припустимо, що у вашому Route шлях: <Route path="/product/:id" element={<ProductPage />} />

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

  // Перевірка на кількість категорій
  const categories = currentProduct?.categories || [];
  const breadcrumbs = [
    { name: "Головна", link: "/" },
    // Якщо є хоча б одна категорія
    ...(categories.length > 0
      ? [
          {
            name: categories[0]?.name || "",
            link: `/catalog/${categories[0]?.slug}`,
          },
        ]
      : []),
    // Якщо є більше ніж 1 категорія
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
            />
          </Layout>

          <ProductList categories={["Новинки"]} defaultCategory="Новинки">
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
