import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../store";

// Основний селектор для отримання всіх категорій
const selectCategories = (state: RootState) => state.categories.categories;

// Селектор для отримання підкатегорій за parentId
export const selectSubcategories = (parentId: number) =>
  createSelector([selectCategories], (categories) =>
    categories.filter((category) => category.parent === parentId)
  );
