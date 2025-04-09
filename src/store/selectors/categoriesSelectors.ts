import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../store";

const selectCategories = (state: RootState) => state.categories.categories;

export const selectSubcategories = (parentId: number) =>
  createSelector([selectCategories], (categories) =>
    categories.filter((category) => category.parent === parentId)
  );
