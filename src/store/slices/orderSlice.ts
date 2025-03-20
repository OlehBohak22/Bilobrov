import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const consumerKey = "ck_f6e14983147c7a65ff3dd554625c6ae3069dbd5b";
const consumerSecret = "cs_f9430f1ca298c36b0001d95521253a5b1deb2fc5";

export interface OrderData {
  payment_method: string;
  payment_method_title: string;
  set_paid: boolean;
  number?: string;
  billing: {
    first_name: string;
    last_name: string;
    middle_name: string;
    address_1: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
    email: string;
    phone: string;
  };
  shipping: {
    first_name: string;
    last_name: string;
    middle_name: string;
    address_1: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
    email: string;
    phone: string;
  };
  line_items: {
    product_id: number;
    quantity: number;
    variation_id?: number;
    image?: { src: string }; // змінили тип на об'єкт з полем src
  }[];
  shipping_lines: {
    method_id: string;
    method_title: string;
    total: string;
  }[];
}

interface OrderState {
  order: OrderData | null;
  cities: any;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: OrderState = {
  order: null,
  status: "idle",
  cities: null,
  error: null,
};

export const createOrder = createAsyncThunk<OrderData, OrderData>(
  "order/createOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "https://bilobrov.projection-learn.website/wp-json/wc/v3/orders",
        orderData,
        {
          headers: {
            Authorization: "Basic " + btoa(`${consumerKey}:${consumerSecret}`),
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Помилка оформлення замовлення"
      );
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.order = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export default orderSlice.reducer;
