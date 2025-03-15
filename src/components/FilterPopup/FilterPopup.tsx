import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import {
  setMinPrice,
  setMaxPrice,
  setOnSale,
  setInStock,
  setCategories,
  fetchProducts,
} from "../../store/slices/filterSlice";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useParams } from "react-router";

const Filters: React.FC = () => {
  const dispatch = useAppDispatch();
  const { minPrice, maxPrice, onSale, inStock, categories, loading } =
    useSelector((state: RootState) => state.filters);

  const { slug } = useParams();

  const allCategories = useSelector(
    (state: RootState) => state.categories.categories
  );
  const category = allCategories.find((cat) => cat.slug === slug);
  const categoryId = category ? category.id.toString() : null;

  // Записуємо категорію лише якщо її ще немає в списку
  useEffect(() => {
    if (categoryId && !categories.includes(categoryId)) {
      dispatch(setCategories([categoryId]));
      dispatch(fetchProducts());
    }
  }, [categoryId, categories, dispatch]);

  const handleCategoryChange = (categoryId: string) => {
    dispatch(
      setCategories(
        categories.includes(categoryId)
          ? categories.filter((cat) => cat !== categoryId)
          : [...categories, categoryId]
      )
    );
  };

  return (
    <div className="filters">
      <div className="filter-section">
        <label>
          <input
            type="checkbox"
            checked={onSale}
            onChange={() => dispatch(setOnSale(!onSale))}
          />
          Зі знижкою
        </label>

        <label>
          <input
            type="checkbox"
            checked={inStock}
            onChange={() => dispatch(setInStock(!inStock))}
          />
          В наявності
        </label>
      </div>

      <div className="filter-section">
        <label>
          Ціна: {minPrice} - {maxPrice}
        </label>
        <input
          type="range"
          min="100"
          max="500"
          value={minPrice}
          onChange={(e) => dispatch(setMinPrice(Number(e.target.value)))}
        />
        <input
          type="range"
          min="100"
          max="10000"
          value={maxPrice}
          onChange={(e) => dispatch(setMaxPrice(Number(e.target.value)))}
        />
      </div>

      <div className="filter-section">
        <label>Категорії:</label>

        {allCategories.map((cat) => (
          <label key={cat.id}>
            <input
              type="checkbox"
              checked={categories.includes(cat.id.toString())}
              onChange={() => handleCategoryChange(cat.id.toString())}
            />
            {cat.name}
          </label>
        ))}
      </div>

      <button onClick={() => dispatch(fetchProducts())} disabled={loading}>
        {loading ? "Завантаження..." : "Застосувати фільтри"}
      </button>
    </div>
  );
};

export default Filters;
