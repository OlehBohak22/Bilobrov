import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../store";

export const selectUserMetaPreferences = createSelector(
  (state: RootState) => state.user?.user?.meta?.preferences,
  (preferences) => preferences || []
);
