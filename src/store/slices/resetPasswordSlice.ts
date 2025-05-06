import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_URL_WP } from "../../constants/api";

interface ResetPasswordState {
  status: "idle" | "loading" | "succeeded" | "failed";
  message: string | null;
  resetToken: string | null;
  error: string | null;
}

const initialState: ResetPasswordState = {
  status: "idle",
  message: null,
  resetToken: null,
  error: null,
};

export const sendResetMail = createAsyncThunk(
  "password/reset/sendMail",
  async (email: string) => {
    const response = await fetch(`${API_URL_WP}users_send_reset_mail`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message ||
          "Не вдалося надіслати інструкції для відновлення паролю"
      );
    }

    const data = await response.json();
    return data;
  }
);

export const resetPassword = createAsyncThunk(
  "password/reset/resetPassword",
  async (
    payload: { password: string; resetToken?: string; old_password?: string },
    { getState }
  ) => {
    const state = getState() as { user: { token: string } };
    const token = payload.resetToken || state.user.token;

    const response = await fetch(`${API_URL_WP}users_reset_password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Не вдалося змінити пароль");
    }

    const data = await response.json();
    return data;
  }
);

const resetPasswordSlice = createSlice({
  name: "password/reset",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(sendResetMail.pending, (state) => {
        state.status = "loading";
      })
      .addCase(sendResetMail.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.message = action.payload.message;
        state.resetToken = action.payload.reset_token;
        state.error = null;
      })
      .addCase(sendResetMail.rejected, (state, action) => {
        state.status = "failed";
        state.message = null;
        state.error =
          action.error.message || "Помилка відправки запиту на відновлення";
      })
      .addCase(resetPassword.pending, (state) => {
        state.status = "loading";
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.status = "failed";
        state.message = null;
        state.error = action.error.message || "Помилка скидання паролю";
      });
  },
});

export default resetPasswordSlice.reducer;
