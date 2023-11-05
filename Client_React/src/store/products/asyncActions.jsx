//dùng để xử lý api
import { createAsyncThunk } from "@reduxjs/toolkit";
import * as apis from "../../apis/product";
export const getProducts = createAsyncThunk(
  "app/products",
  async (data, { rejectWithValue }) => {
    const response = await apis.apiGetProduct({ sort: "-createdAt" });
    // console.log(response);
    if (!response.success) {
      return rejectWithValue(response);
    }
    return response.products;
  }
);
