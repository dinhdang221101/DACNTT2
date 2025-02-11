import { BrowserRouter, Route, Routes } from "react-router-dom";

import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primeicons/primeicons.css";
import "./styles/Global.css";
import "./styles/Home.css";
import Home from "./pages/Home";
import axios from "axios";
import ProductList from "./pages/Products/ProductList";
import ProductDetail from "./pages/Products/ProductDetail";
import Checkout from "./pages/Users/Checkout";
import PaymentResult from "./pages/Users/PaymentResult";
import Confirmation from "./pages/Users/Confirmation";
import Register from "./pages/Users/Register";
import Login from "./pages/Users/Login";
import Cart from "./pages/Users/Cart";
import OrderHistory from "./pages/Users/OrderHistory";
import OrderDetails from "./pages/Users/OrderDetails";
import Layout from "./components/Layout";
import ProductReview from "./pages/Users/ProductReview";
import AdminLayout from "./components/admin/Layout";
import AdminProductList from "./pages/admin/Products/ProductList";
import AdminOrders from "./pages/admin/Orders/AdminOrders";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProductAdd from "./pages/admin/Products/ProductAdd";
import ProductEdit from "./pages/admin/Products/ProductEdit";
import CategoryList from "./pages/admin/Categories/CategoryList";
import CategoryAdd from "./pages/admin/Categories/CategoryAdd";
import CategoryEdit from "./pages/admin/Categories/CategoryEdit";
import RequireAuth from "./components/RequireAuth";
import RequireAuthAdmin from "./components/RequireAuthAdmin";
import UserList from "./pages/admin/Users/UserList";
import UserAdd from "./pages/admin/Users/UserAdd";
import UserEdit from "./pages/admin/Users/UserEdit";
import PromotionList from "./pages/admin/Promotions/PromotionList";
import PromotionAdd from "./pages/admin/Promotions/PromotionAdd";
import PromotionEdit from "./pages/admin/Promotions/PromotionEdit";

axios.defaults.baseURL = "https://localhost:7100/api/";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="category">
              <Route path=":id" element={<ProductList />} />
            </Route>
            <Route path="product">
              <Route path=":id" element={<ProductDetail />} />
            </Route>
            <Route path="checkout">
              <Route
                index
                element={
                  <RequireAuth>
                    <Checkout />
                  </RequireAuth>
                }
              />
            </Route>
            <Route path="payment-result">
              <Route
                index
                element={
                  <RequireAuth>
                    <PaymentResult />
                  </RequireAuth>
                }
              />
            </Route>
            <Route path="confirmation">
              <Route
                index
                element={
                  <RequireAuth>
                    <Confirmation />
                  </RequireAuth>
                }
              />
            </Route>
            <Route path="auth">
              <Route path="register" index element={<Register />} />
              <Route path="login" index element={<Login />} />
            </Route>
            <Route path="cart">
              <Route
                index
                element={
                  <RequireAuth>
                    <Cart />
                  </RequireAuth>
                }
              />
            </Route>
            <Route path="order-history">
              <Route
                index
                element={
                  <RequireAuth>
                    <OrderHistory />
                  </RequireAuth>
                }
              />
              <Route
                path=":id"
                index
                element={
                  <RequireAuth>
                    <OrderDetails />
                  </RequireAuth>
                }
              />
              <Route
                path=":id/product-review"
                index
                element={
                  <RequireAuth>
                    <ProductReview />
                  </RequireAuth>
                }
              />
            </Route>
          </Route>

          <Route
            path="/admin/"
            element={
              <RequireAuthAdmin>
                <AdminLayout />
              </RequireAuthAdmin>
            }
          >
            <Route path="">
              <Route index element={<AdminDashboard />} />
            </Route>
            <Route path="products/">
              <Route index element={<AdminProductList />} />
              <Route path="add" element={<ProductAdd />} />
              <Route path="edit/:id" element={<ProductEdit />} />
            </Route>
            <Route path="categories/">
              <Route index element={<CategoryList />} />
              <Route path="add" element={<CategoryAdd />} />
              <Route path="edit/:id" element={<CategoryEdit />} />
            </Route>
            <Route path="orders/">
              <Route index element={<AdminOrders />} />
            </Route>
            <Route path="users/">
              <Route index element={<UserList />} />
              <Route path="add" element={<UserAdd />} />
              <Route path="edit/:id" element={<UserEdit />} />
            </Route>
            <Route path="promotions/">
              <Route index element={<PromotionList />} />
              <Route path="add" element={<PromotionAdd />} />
              <Route path="edit/:id" element={<PromotionEdit />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
