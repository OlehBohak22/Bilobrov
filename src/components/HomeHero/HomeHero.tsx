import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBanner } from "../../store/slices/bannerSlice"; // Узгоджена назва
import { RootState } from "../../store";

export const HomeHero = () => {
  const dispatch = useDispatch();

  // Отримання стану банерів
  const {
    items: banners,
    loading,
    error,
  } = useSelector((state: RootState) => state.banner);

  // Завантаження банерів при монтуванні
  useEffect(() => {
    dispatch(fetchBanner());
  }, [dispatch]);

  return (
    <div>
      <h1>HomeHero</h1>

      {/* Лоадер під час завантаження */}
      {loading && <p>Loading banners...</p>}

      {/* Виведення помилки, якщо щось пішло не так */}
      {error && <p>Error: {error}</p>}

      {/* Виведення банерів */}
      {Array.isArray(banners) && banners.length > 0 ? (
        banners.map((banner: { id: number; title: { rendered: string } }) => (
          <div key={banner.id}>{banner.title.rendered}</div>
        ))
      ) : (
        <p>No banners available</p>
      )}
    </div>
  );
};
