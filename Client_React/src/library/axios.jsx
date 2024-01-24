// Add a request interceptor
import axios from "axios";
import { API_URL } from "utils/contants";
const instance = axios.create({
  // baseURL: process.env.REACT_APP_API_URL,
  baseURL: API_URL,
  headers: {
    Accept: "application/json",
  },
});

//khi chạy chương trình nó sẽ zô thằng này trước
instance.interceptors.request.use(
  function (config) {
    //Do something before request is sent
    //lấy token từ localStorage
    let localStoragetoken = window.localStorage.getItem("persist:shop/user");
    //chuyển nó về dạng string
    if (localStoragetoken && typeof localStoragetoken === "string") {
      localStoragetoken = JSON.parse(localStoragetoken);
      //chuyển token từ json sang string
      const token = JSON.parse(localStoragetoken.token);
      //truyền nó vào header đây là điều bắt buộc
      config.headers["Authorization"] = "Bearer " + token;
      return config;
    } else {
      return config;
    }
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
//Dùng để xử lsy token
instance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return error.response.data;
  }
);
export default instance;
