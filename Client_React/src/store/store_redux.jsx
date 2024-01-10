import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import appSlice from "./categories/appSlice";
import productSlice from "./products/appSlice";
import userSlice from "./users/userSlice";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

const commonConfig = {
  storage,
};
const userConfig = {
  ...commonConfig,
  //Lưu những giá trị mà localStorge muốn lưu, ta lấy 3 trường trong userSlice
  whitelist: ["isLoggedIn", "token", "current", "currentCart"],
  key: "shop/user",
};
export const store = configureStore({
  reducer: {
    app: appSlice,
    products: productSlice,
    user: persistReducer(userConfig, userSlice),
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
