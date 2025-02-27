import { useEffect } from "react";
import {
  fetchProductById,
  fetchReviews,
} from "../../store/slices/productsSlice";
import { ProductSlider } from "../../components/ProductSlider/ProductSlider";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Layout } from "../../components/Layout/Layout";
import s from "./ProductPage.module.css";
import { ProductContent } from "../../components/ProductContent/ProductContent";

interface HeaderProps {
  openRegister: () => void;
}

export const ProductPage: React.FC<HeaderProps> = ({ openRegister }) => {
  const dispatch = useAppDispatch();
  const { currentProduct, loading, error, reviews } = useSelector(
    (state: any) => state.products
  );

  // Використовуємо useParams, щоб дістати ID з URL
  const { id } = useParams(); // Припустимо, що у вашому Route шлях: <Route path="/product/:id" element={<ProductPage />} />

  const currentReviews = reviews.filter(
    (item: { product_id: any }) => item.product_id == id
  );

  console.log(currentReviews);

  useEffect(() => {
    if (id) {
      // WooCommerce ID зазвичай число, тож приведемо до number (або залишимо string, залежно від API).
      const productIdNumber = parseInt(id, 10);
      dispatch(fetchProductById(productIdNumber));
      dispatch(fetchReviews());
    }
  }, [dispatch, id]);

  if (loading) {
    return <div>Loading product...</div>;
  }

  if (error) {
    return <div>Error loading product: {error}</div>;
  }

  if (!currentProduct) {
    return <div>No product found.</div>;
  }

  const productImages = currentProduct?.images?.map((img: any) => img.src);

  return (
    <main className={s.page}>
      <Layout className="flex gap-[5vw]">
        <ProductSlider images={productImages} />
        <ProductContent openRegister={openRegister} info={currentProduct} />
      </Layout>
    </main>
  );
};
