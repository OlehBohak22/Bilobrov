import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Layout } from "../../components/Layout/Layout";
import s from "./CatalogPage.module.css";
import { RootState, AppDispatch } from "../../store";
import { fetchProducts } from "../../store/slices/productsSlice";
import { ProductItem } from "../../components/ProductItem/ProductItem";

export const CatalogPage = () => {
  const { categorySlug } = useParams<{ categorySlug?: string }>();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchProducts(categorySlug || ""));
  }, [dispatch, categorySlug]);

  const { items: products = [], loading } = useSelector(
    (state: RootState) => state.products
  );

  return (
    <main className={s.page}>
      <Layout>
        <div className={s.categoryHeader}>
          <h1>{categorySlug ? `Категорія: ${categorySlug}` : "Всі товари"}</h1>
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
