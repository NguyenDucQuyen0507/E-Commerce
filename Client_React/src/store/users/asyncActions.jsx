//dùng để xử lý api
import { createAsyncThunk } from "@reduxjs/toolkit";
import * as apis from "../../apis/user";
export const getCurrent = createAsyncThunk(
  "login/user",
  async (data, { rejectWithValue }) => {
    const response = await apis.apiGetCurrent();
    // console.log(response.rs);
    if (!response.success) {
      return rejectWithValue(response);
    }
    return response.rs;
  }
);
