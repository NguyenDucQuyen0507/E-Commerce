import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store, persistor } from "./store/store_redux";
import App from "./App.jsx";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { PersistGate } from "redux-persist/integration/react";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import "numeral/locales/vi";
import numeral from "numeral";
numeral.locale("vi");
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <ToastContainer />
          <App />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </>
);
