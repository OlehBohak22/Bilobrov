import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { ProductInfo } from "../../types/productTypes";
import { API_URL, consumerKey, consumerSecret } from "./productsSlice";

interface option {
  id: number;
  name: string;
  slug: string;
}

interface ProductAttribute {
  name: string;
  slug: string;
  options: option[];
  id: number;
}

interface ProductState {
  products: ProductInfo[];
  loading: boolean;
  sort: "popularity" | "date" | "price_asc" | "price_desc" | "rating";
  selectedAttributes: Record<string, string[]>;
  selectedCategories: string[];
  selectedBrands: string[];
  onSale: boolean;
  inStock: boolean;
  minPrice: number;
  maxPrice: number;
  attributes: ProductAttribute[];
  page: number; // 🔥 додаємо
  hasMore: boolean; // 🔥 для контролю закінчення сторінок
  totalCount: number;
}

const initialState: ProductState = {
  products: [],
  loading: false,
  sort: "popularity",
  selectedAttributes: {},
  selectedCategories: [],
  selectedBrands: [],
  onSale: false,
  inStock: false,
  minPrice: 0,
  maxPrice: 10000,
  attributes: [],
  page: 1, // 🔥 додаємо
  hasMore: true, // 🔥 додаємо
  totalCount: 0,
};

export const fetchAttributes = createAsyncThunk(
  "filters/fetchAttributes",
  async () => {
    const response = await axios.get(
      "https://www.bilobrov.projection-learn.website/wp-json/response/v1/attributes",
      {
        headers: {
          Authorization: "Basic " + btoa(`${consumerKey}:${consumerSecret}`),
        },
      }
    );

    return response.data;
  }
);

export const fetchProducts = createAsyncThunk(
  "filters/fetchProducts",
  async (_, { getState }) => {
    const state = getState() as { filters: ProductState };
    const {
      sort,
      selectedCategories,
      selectedBrands,
      onSale,
      inStock,
      minPrice,
      maxPrice,
      selectedAttributes,
      attributes,
      page,
    } = state.filters;

    const params = new URLSearchParams({
      per_page: "20",
      page: page.toString(),
    });

    const attrEntries = Object.entries(selectedAttributes).filter(
      ([, values]) => values.length > 0
    );

    attrEntries.forEach(([slug, selectedIds]) => {
      const matchedAttribute = attributes.find((attr) => attr.slug === slug);

      if (matchedAttribute) {
        const validIds = matchedAttribute.options
          .filter((opt) => selectedIds.includes(opt.id.toString()))
          .map((opt) => opt.id)
          .join(",");

        if (validIds) {
          params.append("attribute", `pa_${slug}`);
          params.append("attribute_term", validIds);
        }
      }
    });

    // інші параметри
    if (sort === "price_asc") {
      params.set("orderby", "price");
      params.set("order", "asc");
    } else if (sort === "price_desc") {
      params.set("orderby", "price");
      params.set("order", "desc");
    } else if (["date", "popularity", "rating"].includes(sort)) {
      params.set("orderby", sort);
      params.set("order", "desc");
    }

    if (selectedCategories.length > 0) {
      params.set("category", selectedCategories.join(","));
    }

    if (selectedBrands.length > 0) {
      params.set("brand", selectedBrands.join(","));
    }

    if (onSale) {
      params.set("on_sale", "true");
    }

    if (inStock) {
      params.set("stock_status", "instock");
    }

    params.set("min_price", minPrice.toString());
    params.set("max_price", maxPrice.toString());

    const url = `${API_URL}products?${params.toString()}`;

    const response = await axios.get(url, {
      headers: {
        Authorization: "Basic " + btoa(`${consumerKey}:${consumerSecret}`),
      },
    });

    const totalCount = parseInt(response.headers["x-wp-total"]);
    const totalPages = parseInt(response.headers["x-wp-totalpages"]);

    return {
      products: response.data,
      totalCount,
      totalPages,
    };
  }
);

const productSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setSort: (state, action: PayloadAction<ProductState["sort"]>) => {
      state.sort = action.payload;
    },
    setSelectedCategories: (state, action: PayloadAction<string[]>) => {
      state.selectedCategories = action.payload;
    },
    setSelectedBrands: (state, action: PayloadAction<string[]>) => {
      state.selectedBrands = action.payload;
    },
    setOnSale: (state, action: PayloadAction<boolean>) => {
      state.onSale = action.payload;
    },
    setInStock: (state, action: PayloadAction<boolean>) => {
      state.inStock = action.payload;
    },
    setMinPrice: (state, action: PayloadAction<number>) => {
      state.minPrice = action.payload;
    },
    setMaxPrice: (state, action: PayloadAction<number>) => {
      state.maxPrice = action.payload;
    },
    setSelectedAttributes: (
      state,
      action: PayloadAction<Record<string, string[]>>
    ) => {
      state.selectedAttributes = action.payload;
    },

    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    incrementPage: (state) => {
      state.page += 1;
    },
    resetPage: (state) => {
      state.page = 1;
      state.hasMore = true;
    },

    resetFilters: (state) => {
      state.products = [];
      state.loading = false;
      state.sort = "popularity";
      state.selectedCategories = [];
      state.selectedBrands = [];
      state.onSale = false;
      state.inStock = false;
      state.minPrice = 0;
      state.maxPrice = 10000;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        const { products, totalCount } = action.payload;

        let sortedProducts = products;
        if (state.sort === "price_asc") {
          sortedProducts = [...products].sort(
            (a, b) => parseFloat(a.price) - parseFloat(b.price)
          );
        } else if (state.sort === "price_desc") {
          sortedProducts = [...products].sort(
            (a, b) => parseFloat(b.price) - parseFloat(a.price)
          );
        }

        state.products = sortedProducts; // 🔥 Замінюємо завжди

        state.hasMore = sortedProducts.length === 20;
        state.totalCount = totalCount;
        state.loading = false;
      })

      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        console.error("❌ fetchProducts rejected:", action.error);
      })
      .addCase(fetchAttributes.fulfilled, (state, action) => {
        state.attributes = action.payload;
      });
  },
});

export const {
  setSort,
  setSelectedCategories,
  setSelectedBrands,
  setOnSale,
  setInStock,
  setMinPrice,
  setMaxPrice,
  setSelectedAttributes,
  resetFilters,
  setPage,
  incrementPage,
  resetPage,
} = productSlice.actions;

export default productSlice.reducer;
