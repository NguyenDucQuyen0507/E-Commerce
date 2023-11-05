import { createSlice } from "@reduxjs/toolkit";
import * as actions from "./asyncActions";
export const userSlice = createSlice({
  name: "login",
  initialState: {
    //có 3 trạng thái (đăng nhập hay chưa, data của người đó và token.)
    isLoggedIn: false,
    isLoading: false,
    current: null,
    token: null,
    mes: "",
    currentCart: [],
  },
  reducers: {
    //xử lý đồng bộ
    login: (state, action) => {
      // console.log(action);
      state.isLoggedIn = action.payload.isLoggedIn;
      state.token = action.payload.token;
    },
    logout: (state, action) => {
      state.isLoggedIn = false;
      state.isLoading = false;
      state.current = null;
      state.token = null;
      state.mes = "";
    },
    clearMess: (state) => {
      state.mes = "";
    },
    updateCart: (state, action) => {
      //trong action chứa type(login/updateCart) và payload (trong đó payload) là giá trị được truyền vào
      // console.log(action.payload);
      // const { pid, quantity, color } = action.payload;
      // const updateCart = JSON.parse(JSON.stringify(state.currentCart));
      // const update = updateCart.map((el) => {
      //   if (el.color === color && el.product._id === pid) {
      //     return { ...el, quantity };
      //   } else {
      //     return el;
      //   }
      // });
      // state.currentCart = update;
      const { pid, quantity, color } = action.payload;
      const productIndex = state.currentCart.findIndex(
        (item) => item.color === color && item.product._id === pid
      );
      if (productIndex !== -1) {
        state.currentCart[productIndex].quantity = quantity;
      }
    },
  },
  extraReducers: (builder) => {
    // Bắt đầu thực hiện action login (Promise pending)
    builder.addCase(actions.getCurrent.pending, (state) => {
      // Bật trạng thái loading
      state.isLoading = true;
    });
    // Khi thực hiện action login thành công (Promise fulfilled)
    builder.addCase(actions.getCurrent.fulfilled, (state, action) => {
      // console.log(action);
      // Tắt trạng thái loading, lưu thông tin cate vào store
      state.isLoading = false;
      state.current = action.payload;
      //action.payload là reponse được trả về từ file asyncActions.jsx
      state.isLoggedIn = true;
      //Lưu giá trị cart trong user
      state.currentCart = action.payload.cart;
    });
    // Khi thực hiện action login thất bại (Promise rejected)
    builder.addCase(actions.getCurrent.rejected, (state, action) => {
      // Tắt trạng thái loading, lưu thông báo lỗi vào store
      //khi hết hạn token thì nó sẽ set hết tất cả về dạng mặc định. Vì nếu không set thì lúc trên localStorge vẫn còn lưu token và isLoggin là true mặc dù đã hết hạn token
      state.isLoading = false;
      state.current = null;
      state.isLoggedIn = false;
      state.current = null;
      state.mes = "Session has expired, please login again!";
    });
  },
});
export const { login, logout, clearMess, updateCart } = userSlice.actions;
const userReducer = userSlice.reducer;
export default userReducer;
