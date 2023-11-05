const hocFunction1 = (params) => {
  console.log("1" + params);
};

const hocFunction2 = (params) => {
  console.log(params);
};
const hocFunction_hoc = (callback) => (x) => {
  const t = "dep trai";
  callback(x + t);
};
// hocFunction2("Quyen");
// hocFunction1("Quyen");
hocFunction_hoc(hocFunction1)("Quyền");
