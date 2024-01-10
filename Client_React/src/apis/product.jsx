import axios from "../library/axios";
export const apiGetProduct = (params) =>
  axios({
    url: "/product/",
    method: "GET",
    params,
  });
export const apiGetCurrentProduct = (pid) =>
  axios({
    url: "/product/" + pid,
    method: "GET",
  });
export const apiRatings = (data) =>
  axios({
    url: "product/ratings/",
    method: "PATCH",
    data,
  });
export const apiCreateProduct = (data) =>
  axios({
    url: "/product/",
    method: "POST",
    data,
  });
export const apiUpdateProduct = (data, pid) =>
  axios({
    url: "/product/" + pid,
    method: "PATCH",
    data,
  });
export const apiVarientProduct = (data, pid) =>
  axios({
    url: "/product/varient/" + pid,
    method: "PATCH",
    data,
  });
export const apiDeleteProduct = (pid) =>
  axios({
    url: "/product/" + pid,
    method: "DELETE",
  });

//Order
export const apiCreateOrder = (data) =>
  axios({
    url: "/order/",
    method: "POST",
    data,
  });

export const apiGetUserOrder = (params) =>
  axios({
    url: "/order/",
    method: "GET",
    params,
  });
export const apiGetAllOrder = (params) =>
  axios({
    url: "/order/admin/",
    method: "GET",
    params,
  });
export const apiDeleteUserOrder = (orId) =>
  axios({
    url: "/order/" + orId,
    method: "DELETE",
  });
