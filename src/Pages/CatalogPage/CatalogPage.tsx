import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Layout } from "../../components/Layout/Layout";
import s from "./CatalogPage.module.css";
import { RootState } from "../../store";
import { ProductItem } from "../../components/ProductItem/ProductItem";
import Filters from "../../components/FilterPopup/FilterPopup";

export const CatalogPage = () => {
  const { categorySlug } = useParams<{ categorySlug?: string }>();

  const { products, loading } = useSelector(
    (state: RootState) => state.filters
  );

  return (
    <main className={s.page}>
      <Layout>
        <div className={s.categoryHeader}>
          <h1>{categorySlug ? `Категорія: ${categorySlug}` : "Всі товари"}</h1>
        </div>

        <Filters />

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
