import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../../redux/slices/cartSlice";
import { Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

const CalculateEstmatedTime = (createdAt) => {
  const currentDate = new Date();
  const timeDiff = currentDate - createdAt;
  const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const estimatedDeliveryDate = new Date(createdAt);
  estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 7);
  return estimatedDeliveryDate.toLocaleDateString();
};

const OrderConfirmationPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders, loading } = useSelector((state) => state.order);

  useEffect(() => {
    // Clear the cart after successful order
    dispatch(clearCart());
    localStorage.removeItem("cart");
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading order details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-8 text-center">
          <div className="flex justify-center mb-6">
            <FaCheckCircle className="text-green-500 text-6xl" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Order Confirmed!
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Thank you for your purchase. Your order has been successfully placed and is being processed.
          </p>
          
          <div className="space-y-4">
            <p className="text-gray-600">
              We'll send you an email confirmation with your order details.
            </p>
            
            <div className="pt-6 space-x-4">
              <Link
                to="/"
                className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Continue Shopping
              </Link>
              <Link
                to="/my-orders"
                className="inline-block bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
              >
                View My Orders
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
