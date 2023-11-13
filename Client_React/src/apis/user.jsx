import axios from "../library/axios";
export const apiRegister = (data) =>
  axios({
    url: "/user/register",
    method: "POST",
    data,
    withCredentials: true,
  });
export const apiFinalRegister = (token) =>
  axios({
    url: "/user/finalregister/" + token,
    method: "PATCH",
  });
export const apiLogin = (data) =>
  axios({
    url: "/user/login",
    method: "POST",
    data,
  });
export const apiForgotPassword = (data) =>
  axios({
    url: "/user/forgotpassword",
    method: "POST",
    data,
  });
export const apiResetPassword = (data) =>
  axios({
    url: "/user/resetpassword",
    method: "PATCH",
    data,
  });
export const apiGetCurrent = () =>
  axios({
    url: "/user/getCurent",
    method: "GET",
  });
export const apiGetUsers = (params) =>
  axios({
    url: "/user/",
    method: "GET",
    params,
  });
//ByAdmin
export const apiUpdateUsers = (data, uid) =>
  axios({
    url: "/user/" + uid,
    method: "PATCH",
    data,
  });
export const apiUpdateCurrent = (data) =>
  axios({
    url: "/user/current",
    method: "PATCH",
    data,
  });
export const apiDeleteUsers = (uid) =>
  axios({
    url: "/user/" + uid,
    method: "DELETE",
  });
export const apiAddCartUsers = (data) =>
  axios({
    url: "/user/cart",
    method: "PATCH",
    data,
  });
export const apiRemoveCartUsers = (pid, color) =>
  axios({
    url: `/user/remove-cart/${pid}/${color}`,
    method: "DELETE",
  });
export const apiLogout = () =>
  axios({
    url: "/user/logout",
    method: "GET",
  });
export const apiWishlist = (pid) =>
  axios({
    url: "/user/wishlist/" + pid,
    method: "PATCH",
  });
