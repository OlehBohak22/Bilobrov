// import { useEffect } from "react";
// import { useLocation } from "react-router-dom";
// import { useAppDispatch } from "./useAppDispatch";
// import {
//   setSort,
//   setSelectedCategories,
//   setSelectedBrands,
// } from "../store/slices/filterSlice";

// export const useFiltersFromUrl = () => {
//   const location = useLocation();
//   const dispatch = useAppDispatch();

//   useEffect(() => {
//     const query = new URLSearchParams(location.search);

//     const sort = query.get("sort") as "default" | "price_asc" | "price_desc";
//     const categories = query.get("categories")?.split(",") || [];
//     const brands = query.get("brands")?.split(",") || [];

//     if (sort) dispatch(setSort(sort));
//     if (categories.length > 0) dispatch(setSelectedCategories(categories));
//     if (brands.length > 0) dispatch(setSelectedBrands(brands));
//   }, [location.search, dispatch]);
// };
