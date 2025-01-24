import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchBrands,
  selectBrands,
} from "../../store/slices/popularBrandsSlice";

export const PopularBrands = () => {
  const dispatch = useDispatch();
  const brands = useSelector(selectBrands);

  useEffect(() => {
    dispatch(fetchBrands());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {brands.map((brand) => (
        <div key={brand.id}>
          <h3>{brand.name}</h3>
          <a href={brand.link}>View Brand</a>
        </div>
      ))}
    </div>
  );
};
