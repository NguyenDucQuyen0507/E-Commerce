import { createSlice } from "@reduxjs/toolkit";
import * as actions from "./asyncActions";
export const appSlice = createSlice({
  name: "app",
  initialState: {
    categories: [],
    isLoading: false,
    //dùng để hiển thị modal và nội dung bên trong modal
    isShowModal: false,
    modalChildren: null,
    isShowCart: false,
  },
  reducers: {
    //xử lý đồng bộ
    showModal: (state, action) => {
      state.isShowModal = action.payload.isShowModal;
      state.modalChildren = action.payload.modalChildren;
    },
    showCart: (state) => {
      //nếu đang là false thì click lần đầu sẽ là true lần 2 sẽ là false.
      state.isShowCart = state.isShowCart === false ? true : false;
    },
  },
  extraReducers: (builder) => {
    // Bắt đầu thực hiện action login (Promise pending)
    builder.addCase(actions.getCategories.pending, (state) => {
      // Bật trạng thái loading
      state.isLoading = true;
    });
    // Khi thực hiện action login thành công (Promise fulfilled)
    builder.addCase(actions.getCategories.fulfilled, (state, action) => {
      // console.log(action);
      // Tắt trạng thái loading, lưu thông tin cate vào store
      state.isLoading = false;
      state.categories = action.payload;
      //action.payload là reponse được trả về từ file asyncActions.jsx
    });
    // Khi thực hiện action login thất bại (Promise rejected)
    builder.addCase(actions.getCategories.rejected, (state, action) => {
      // Tắt trạng thái loading, lưu thông báo lỗi vào store
      state.isLoading = false;
      state.errorMessage = action.payload.errorMessage;
    });
  },
});
export const { showModal, showCart } = appSlice.actions;
const blogReducer = appSlice.reducer;
export default blogReducer;
