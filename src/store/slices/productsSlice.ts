import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ProductInfo } from "../../types/productTypes";

const API_URL = "https://bilobrov.projection-learn.website/wp-json/wc/v3/";
const consumerKey = "ck_f6e14983147c7a65ff3dd554625c6ae3069dbd5b";
const consumerSecret = "cs_f9430f1ca298c36b0001d95521253a5b1deb2fc5";

const headers = new Headers();
headers.set(
  "Authorization",
  "Basic " + btoa(`${consumerKey}:${consumerSecret}`)
);

interface ProductState {
  items: ProductInfo[];
  certificates: ProductInfo[];
  loading: boolean;
  currentProduct: ProductInfo | null;
  reviews: any[];
  variations: ProductInfo[];
  error: string | null;
  reviewMessage: string | null; // Повідомлення для відгуку
  reviewError: string | null; // Помилка для відгуку
}

const initialState: ProductState = {
  items: [],
  certificates: [],
  loading: false,
  currentProduct: null,
  reviews: [],
  variations: [],
  error: null,
  reviewMessage: null,
  reviewError: null,
};

// Асинхронна операція для додавання відгуку
export const addReview = createAsyncThunk(
  "products/addReview",
  async (
    {
      formData,
      headers = {},
    }: {
      formData: FormData;
      headers: { [key: string]: string };
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(
        "https://bilobrov.projection-learn.website/wp-json/responses/v1/add-review",
        {
          method: "POST",
          headers,
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.log(data.message);
        throw new Error(data.message || "Помилка при додаванні відгуку");
      }

      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Не вдалося відправити відгук");
    }
  }
);

export const fetchProducts = createAsyncThunk<
  ProductInfo[],
  string | undefined,
  { rejectValue: string }
>("products/fetchProducts", async (categorySlug, { rejectWithValue }) => {
  try {
    const url = categorySlug
      ? `${API_URL}products?category=${categorySlug}`
      : `${API_URL}products?per-page=10000000000000000000000000000000`;

    const response = await fetch(url, {
      method: "GET",
      headers: headers,
    });

    if (!response.ok) {
      throw new Error("Помилка при завантаженні товарів");
    }

    return await response.json();
  } catch (error) {
    console.log(error);
    return rejectWithValue("Не вдалося отримати товари");
  }
});

export const fetchProductById = createAsyncThunk<ProductInfo, number>(
  "products/fetchProductById",
  async (productId) => {
    const response = await fetch(`${API_URL}products/${productId}`, {
      method: "GET",
      headers: headers,
    });
    if (!response.ok) {
      throw new Error("Failed to fetch product");
    }
    return await response.json();
  }
);

export const fetchProductVariations = createAsyncThunk<ProductInfo[], number>(
  "products/fetchProductVariations",
  async (productId) => {
    const response = await fetch(`${API_URL}products/${productId}/variations`, {
      method: "GET",
      headers: headers,
    });
    if (!response.ok) {
      throw new Error("Failed to fetch product");
    }
    return await response.json();
  }
);

export const fetchVariationById = createAsyncThunk<
  ProductInfo,
  { productId: number; variationId: number }
>("products/fetchVariationById", async ({ productId, variationId }) => {
  const response = await fetch(
    `${API_URL}products/${productId}/variations/${variationId}`,
    {
      method: "GET",
      headers: headers,
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch variation");
  }
  return await response.json();
});

export const fetchReviews = createAsyncThunk(
  "products/fetchReviews",
  async () => {
    const response = await fetch(`${API_URL}products/reviews?per_page=15`, {
      method: "GET",
      headers: headers,
    });
    if (!response.ok) {
      throw new Error("Failed to fetch reviews");
    }
    return await response.json();
  }
);

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    resetReviewState: (state) => {
      state.reviewMessage = null;
      state.reviewError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;

        state.items = action.payload.filter(
          (product: any) => product.catalog_visibility == "visible"
        );

        state.certificates = action.payload.filter(
          (item: any) => item.categories[0]?.slug === "certificate"
        );
      });

    builder.addCase(fetchVariationById.fulfilled, (state, action) => {
      state.loading = false;
      if (state.currentProduct) {
        state.currentProduct = {
          ...state.currentProduct,
          price: action.payload.price,
          sale_price: action.payload.sale_price,
          regular_price: action.payload.regular_price,
          images: action.payload.image
            ? [
                action.payload.image,
                ...state.currentProduct.images.filter(
                  (img) => img.id !== action.payload.image.id
                ),
              ]
            : state.currentProduct.images,
          sku: action.payload.sku,
          attributes: action.payload.attributes,
        };
      }
    });

    builder.addCase(fetchProductById.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.currentProduct = null;
    });
    builder.addCase(fetchProductById.fulfilled, (state, action) => {
      state.loading = false;
      state.currentProduct = action.payload;
    });
    builder.addCase(fetchProductById.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(fetchReviews.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchReviews.fulfilled, (state, action) => {
      state.loading = false;
      state.reviews = action.payload;
    });
    builder.addCase(fetchReviews.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(fetchProductVariations.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchProductVariations.fulfilled, (state, action) => {
      state.loading = false;
      state.variations = action.payload;
    });
    builder.addCase(fetchProductVariations.rejected, (state) => {
      state.loading = false;
    });

    builder
      .addCase(addReview.pending, (state) => {
        state.loading = true;
        state.reviewMessage = null;
        state.reviewError = null;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviewMessage = action.payload.message;
      })
      .addCase(addReview.rejected, (state, action) => {
        state.loading = false;
        state.reviewError = action.payload as string;
      });
  },
});

export default productSlice.reducer;
