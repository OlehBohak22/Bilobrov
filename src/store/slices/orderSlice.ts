import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL_WC, consumerKey, consumerSecret } from "../../constants/api";

export interface OrderData {
  meta_data?: any;
  id?: number;
  payment_method: string;
  payment_method_title: string;
  set_paid: boolean;
  status: string;
  customer_id?: number;
  shipping_type: string;
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
    image?: { src: string };
  }[];
  // shipping_lines: {
  //   method_id: string;
  //   method_title: string;
  //   total: string;
  // }[];
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
    console.log("Клієнт", orderData);
    try {
      const response = await axios.post(`${API_URL_WC}orders`, orderData, {
        headers: {
          Authorization: "Basic " + btoa(`${consumerKey}:${consumerSecret}`),
          "Content-Type": "application/json",
        },
      });
      console.log("Сервер", response.data);
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
