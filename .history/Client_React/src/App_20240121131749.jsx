import "./App.css";
import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import {
  Home,
  Login,
  Products,
  Public,
  Blogs,
  Services,
  FAQ,
  ProductsDetails,
  FinalRegister,
  ResetPassword,
  DetailCart,
} from "pages/public";
import {
  AdminLayout,
  CreateProducts,
  Dasboard,
  ManageOrder,
  ManageProducts,
  ManageUser,
} from "pages/admin";
import {
  MemberLayout,
  Persional,
  History,
  MyCart,
  Wislist,
  CheckOut,
} from "pages/member";
import path from "utils/path";
import { getCategories } from "store/categories/asyncActions";
import { useDispatch, useSelector } from "react-redux";
import { Modal, YourCart } from "components";
import { showCart } from "store/categories/appSlice";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getCategories());
  }, []);
  const { isShowModal, modalChildren, isShowCart } = useSelector(
    (state) => state.app
  );
  const [loading, setLoading] = useState(true);
  const fetchProduct = async () => {
    const response = await apiGetProduct();
    if (response.success) {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProduct();
  }, []);
  return (
    <div className="">
      <header></header>
      <section>
        <div className=" font-main min-h-screen relative">
          {isShowCart && (
            <div
              onClick={() => dispatch(showCart())}
              className="absolute inset-0 bg-overlay z-50 flex justify-end"
            >
              <YourCart />
            </div>
          )}
          {isShowModal && <Modal>{modalChildren}</Modal>}
          <Routes>
            {/* Passing guests */}
            <Route path={path.CHECKOUT} element={<CheckOut />} />
            <Route path={path.PUBLIC} element={<Public />}>
              {/* Đây là phần Outlet */}
              <Route path={path.HOME} element={<Home />} />
              <Route path={path.PRODUCTS_CATE} element={<Products />} />
              {/* <Route path={path.BLOGS} element={<Blogs />} /> */}
              <Route path={path.OUR_SERVICES} element={<Services />} />
              <Route path={path.FAQ} element={<FAQ />} />
              <Route
                path={path.PRODUCTS_DETAILS__CATE__PID__TITLE}
                element={<ProductsDetails />}
              />
              <Route path={path.ALL} element={<Home />} />
              {/* <Route path={path.DETAIL_CART} element={<DetailCart />} /> */}
            </Route>
            <Route path={path.LOGIN} element={<Login />} />
            <Route path={path.FINAL} element={<FinalRegister />} />
            <Route path={path.RESET_PASSWORD} element={<ResetPassword />} />
            {/* admin */}
            <Route path={path.ADMIN} element={<AdminLayout />}>
              <Route path={path.CREATE_PRODUCTS} element={<CreateProducts />} />
              <Route path={path.DASHBOARD} element={<Dasboard />} />
              <Route path={path.MANAGE_ORDER} element={<ManageOrder />} />
              <Route path={path.MANAGE_PRODUCTS} element={<ManageProducts />} />
              <Route path={path.MANAGE_USER} element={<ManageUser />} />
            </Route>
            {/* member */}
            <Route path={path.MEMBER} element={<MemberLayout />}>
              <Route path={path.PERSONAL} element={<Persional />} />
              <Route path={path.HISTORY} element={<History />} />
              <Route path={path.CART} element={<DetailCart />} />
              <Route path={path.WISHLIST} element={<Wislist />} />
            </Route>
            <Route
              path="*"
              element={
                <main style={{ padding: "1rem" }}>
                  <p>404 Page not found 😂😂😂</p>
                </main>
              }
            />
          </Routes>
          {/* <Route></Route> */}
        </div>
      </section>
      <footer></footer>
    </div>
  );
}

export default App;
