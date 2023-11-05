import axios from "../library/axios";
export const apiGetCategories = () =>
  axios({
    url: "/productCategory",
    method: "GET",
  });
