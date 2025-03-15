import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Layout } from "../../components/Layout/Layout";
import s from "./CatalogPage.module.css";
import { RootState } from "../../store";
import { ProductItem } from "../../components/ProductItem/ProductItem";
import Filters from "../../components/FilterPopup/FilterPopup";

export const CatalogPage = () => {
  const { products, loading } = useSelector(
    (state: RootState) => state.filters
  );

  const { slug } = useParams();

  const allCategories = useSelector(
    (state: RootState) => state.categories.categories
  );
  const category = allCategories.find((cat) => cat.slug === slug);
  const categoryName = category ? category.name : null;

  return (
    <main className={s.page}>
      <Layout>
        <div className={s.categoryHeader}>
          <h1>{categoryName ? categoryName : "Всі товари"}</h1>
          <span>{products.length} продукти</span>
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
