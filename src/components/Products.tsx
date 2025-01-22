import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../store/slices/productsSlice"; // Узгоджена назва
import { RootState } from "../store";

const Products = () => {
  const dispatch = useDispatch();
  const {
    items: products,
    loading,
    error,
  } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Products</h1>
      <ul>
        {Array.isArray(products) &&
          products.map((product: { id: number; name: string }) => (
            <li key={product.id}>{product.name}</li>
          ))}
      </ul>
    </div>
  );
};

export default Products;
