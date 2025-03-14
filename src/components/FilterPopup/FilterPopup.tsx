import React from "react";
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

const Filters: React.FC = () => {
  const dispatch = useAppDispatch();
  const { minPrice, maxPrice, onSale, inStock, categories, loading } =
    useSelector((state: RootState) => state.filters);

  console.log(categories);

  const handleCategoryChange = (id: number) => {
    dispatch(
      setCategories(
        categories.includes(id)
          ? categories.filter((cat) => cat !== id)
          : [...categories, id]
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
          max="500"
          value={maxPrice}
          onChange={(e) => dispatch(setMaxPrice(Number(e.target.value)))}
        />
      </div>

      <div className="filter-section">
        <label>Категорії:</label>
        <label>
          <input
            type="checkbox"
            checked={categories.includes(22)}
            onChange={() => handleCategoryChange(22)}
          />
          Очищення
        </label>
        <label>
          <input
            type="checkbox"
            checked={categories.includes(30)}
            onChange={() => handleCategoryChange(30)}
          />
          Сироватки
        </label>
      </div>

      <button onClick={() => dispatch(fetchProducts())} disabled={loading}>
        {loading ? "Завантаження..." : "Застосувати фільтри"}
      </button>
    </div>
  );
};

export default Filters;
