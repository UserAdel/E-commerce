import { Route, Routes } from "react-router-dom";
import Userlayout from "./components/Layout/Userlayout";
import Home from "../src/components/Pages/Home";
import Login from "./components/Pages/Login";
import Register from "./components/Pages/Register";
import { Toaster } from "sonner";
import Profile from "./components/Pages/Profile";
import CollectionPage from "./components/Pages/CollectionPage";
import ProductDetails from "./components/Products/ProductDetails";
import Checkout from "./components/Cart/Checkout";
import OrderConfirmationPage from "./components/Pages/OrderConfirmationPage";
import MyOrderPage from "./components/Pages/MyOrderPage";
import OrderDetailsPage from "./components/Pages/OrderDetailsPage";
import AdminLayout from "./components/Admin/AdminLayout";
import AdminHomePage from "./components/Pages/AdminHomePage";
import UserManagement from "./components/Admin/UserManagement";
import ProductManagement from "./components/Admin/ProductManagement";
import EditProductPage from "./components/Admin/EditProductPage";
import OrderManagementPage from "./components/Admin/OrderManagementPage";

import { Provider } from "react-redux";
import store from "./redux/Store";
import ProtectedRoute from "./components/Common/ProtectedRoute";

function App() {
  return (
    <Provider store={store}>
      <>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Userlayout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="Profile" element={<Profile />} />
            <Route
              path="collections/:collection"
              element={<CollectionPage />}
            />
            <Route path="Product/:id" element={<ProductDetails />} />
            <Route path="Checkout" element={<Checkout />} />
            <Route
              path="order-confirmation"
              element={<OrderConfirmationPage />}
            />
            <Route path="order/:id" element={<OrderDetailsPage />} />
            <Route path="my-orders" element={<MyOrderPage />} />
          </Route>

          <Route
            path="admin"
            element={
              <ProtectedRoute role="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminHomePage />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="products/:id/edit" element={<EditProductPage />} />
            <Route path="orders" element={<OrderManagementPage />} />
          </Route>
        </Routes>
      </>
    </Provider>
  );
}

export default App;
