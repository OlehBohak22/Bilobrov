import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const URL =
  "https://bilobrov.projection-learn.website/wp-json/responses/v1/user_address";

interface Address {
  first_name?: string;
  last_name?: string;
  phone?: string;
  middle_name: string;
  city: string;
  street: string;
  house: string;
  entrance: string;
  apartment: string;
  selected: boolean;
  delivery_type: string; // Обмежуємо значення лише двома варіантами
  department: string;
}

interface AddressState {
  message: string | null;
  error: string | null;
}

const initialState: AddressState = {
  message: null,
  error: null,
};

// Додавання адреси
export const addAddress = createAsyncThunk(
  "address/addAddress",
  async ({ token, address }: { token: string; address: Address }) => {
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(address),
    });

    console.log(response);

    if (!response.ok) {
      throw new Error("Не вдалося додати адресу");
    }

    const data = await response.json();

    console.log(data);
    return data.message;
  }
);

// Видалення адреси
export const deleteAddress = createAsyncThunk(
  "address/deleteAddress",
  async ({ token, addressId }: { token: string; addressId: string }) => {
    const response = await fetch(URL, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: addressId }),
    });

    if (!response.ok) {
      throw new Error("Не вдалося видалити адресу");
    }

    const data = await response.json();
    return data.message;
  }
);

// Оновлення адреси
export const updateAddress = createAsyncThunk(
  "address/updateAddress",
  async ({ token, address }: { token: string; address: Address }) => {
    const response = await fetch(URL, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(address),
    });

    if (!response.ok) {
      throw new Error("Не вдалося оновити адресу");
    }

    const data = await response.json();
    return data.message;
  }
);

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addAddress.fulfilled, (state, action) => {
        state.message = action.payload;
        state.error = null;
      })
      .addCase(addAddress.rejected, (state, action) => {
        state.message = null;
        state.error = action.error.message || "Щось пішло не так";
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.message = action.payload;
        state.error = null;
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.message = null;
        state.error = action.error.message || "Щось пішло не так";
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.message = action.payload;
        state.error = null;
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.message = null;
        state.error = action.error.message || "Щось пішло не так";
      });
  },
});

export default addressSlice.reducer;
