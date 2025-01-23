import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../store/slices/productsSlice";
import { RootState, AppDispatch } from "../../store/index";
import { ProductItem } from "../ProductItem/ProductItem";
import s from "./ProductList.module.css";

interface Product {
  id: number;
  name: string;
  images?: { src: string; alt?: string }[]; // Типізуємо `images`, якщо є
  // Додати інші властивості продукту, якщо потрібно
}

export const ProductList = () => {
  const dispatch = useDispatch<AppDispatch>(); // Типізований `dispatch`

  const {
    items: products = [],
    loading,
    error,
  } = useSelector((state: RootState) => state.products); // Типізований селектор

  useEffect(() => {
    dispatch(fetchProducts()); // Завантаження продуктів
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Products</h1>
      <ul className={s.productList}>
        {products.map((product: Product) => (
          <ProductItem key={product.id} info={product} />
        ))}
      </ul>
    </div>
  );
};
