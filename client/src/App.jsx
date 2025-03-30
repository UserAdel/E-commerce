import { Route, Routes } from "react-router-dom";
import Userlayout from "./components/Layout/Userlayout";
import Home from "../src/components/Pages/Home";
import Login from "./components/Pages/Login";
import Register from "./components/Pages/Register"; 
import { Toaster } from 'sonner';
import Profile from "./components/Pages/Profile";
import CollectionPage from "./components/Pages/CollectionPage";
import ProductDetails from "./components/Products/ProductDetails";
import Checkout from "./components/Cart/checkout";    
import OrderConfirmationPage from "./components/Pages/OrderConfirmationPage";
import MyOrderPage from "./components/Pages/MyOrderPage";
import OrderDetailsPage from "./components/Pages/OrderDetailsPage";
import AdminLayout from "./components/Admin/AdminLayout";
import AdminHomePage from "./components/Pages/AdminHomePage";
import UserManagement from "./components/Admin/UserManagement";




function App() {
  return (
    <>
    <Toaster position="top-right"/>
    <Routes>
      <Route path="/" element={<Userlayout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="Profile" element={<Profile />} />
        <Route path="Collection/:collection" element={<CollectionPage />} />
        <Route path="Product/:id" element={<ProductDetails />} />
        <Route path="Checkout" element={<Checkout />} />
        <Route path="OrderConfirmtion" element={<OrderConfirmationPage />} />
        <Route path="order/:id" element={<OrderDetailsPage />} />
        <Route path="my-orders" element={<MyOrderPage />} />
      </Route>

      <Route path="admin" element={<AdminLayout />} > 
      <Route index element={<AdminHomePage />} />
      <Route path="users" element={<UserManagement />} />

      </Route>
    </Routes>
    </>
  );
}

export default App;
