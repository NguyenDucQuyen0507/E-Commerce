import { createSlice } from "@reduxjs/toolkit";
import * as actions from "./asyncActions";
export const productSlice = createSlice({
  name: "app",
  initialState: {
    newProducts: [],
    isLoading: false,
  },
  reducers: {
    // logout: (state) => {
    //   state.isLoading = false;
    // },
  },
  extraReducers: (builder) => {
    // Bắt đầu thực hiện action login (Promise pending)
    builder.addCase(actions.getProducts.pending, (state) => {
      // Bật trạng thái loading
      state.isLoading = true;
    });
    // Khi thực hiện action login thành công (Promise fulfilled)
    builder.addCase(actions.getProducts.fulfilled, (state, action) => {
      // console.log(action);
      // Tắt trạng thái loading, lưu thông tin cate vào store
      state.isLoading = false;
      state.newProducts = action.payload;
      //action.payload là reponse được trả về từ file asyncActions.jsx
    });
    // Khi thực hiện action login thất bại (Promise rejected)
    builder.addCase(actions.getProducts.rejected, (state, action) => {
      // Tắt trạng thái loading, lưu thông báo lỗi vào store
      state.isLoading = false;
      state.errorMessage = action.payload.errorMessage;
    });
  },
});
export const { logout } = productSlice.actions;
const blogReducer = productSlice.reducer;
export default blogReducer;
