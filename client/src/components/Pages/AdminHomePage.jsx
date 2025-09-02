import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminProducts } from "../../redux/slices/adminProductSlice";
import { fetchAllOrders } from "../../redux/slices/adminOrderSlice";
import { toast } from "sonner";

const AdminHomePage = () => {
  const dispatch = useDispatch();
  const {
    products = [],
    loading: productsLoading,
    error: productsError,
  } = useSelector((state) => state.adminProduct) || {};

  const {
    orders = [],
    loading: ordersLoading,
    error: ordersError,
  } = useSelector((state) => state.adminOrder) || {};

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          dispatch(fetchAdminProducts()).unwrap(),
          dispatch(fetchAllOrders()).unwrap()
        ]);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to load dashboard data");
      }
    };

    fetchData();
  }, [dispatch]);

  if (productsLoading || ordersLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading dashboard data...</p>
      </div>
    );
  }

  if (productsError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-red-500">Error fetching products: {productsError}</p>
      </div>
    );
  }

  if (ordersError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-red-500">Error fetching orders: {ordersError}</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Total Products</h2>
          <p className="text-3xl font-bold">{products?.length || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Total Orders</h2>
          <p className="text-3xl font-bold">{orders?.length || 0}</p>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="px-4 py-2">ORDER ID</th>
                <th className="px-4 py-2">USER</th>
                <th className="px-4 py-2">TOTAL PRICE</th>
                <th className="px-4 py-2">STATUS</th>
              </tr>
            </thead>
            <tbody className="bg-white shadow-md text-center text-gray-700">
              {orders && orders.length > 0 ? (
                orders.slice(0, 5).map((order) => (
                  <tr
                    key={order._id}
                    className="border-b text-gray-500 hover:bg-gray-100"
                  >
                    <td className="px-4 py-2">{order._id}</td>
                    <td className="px-4 py-2">{order.user?.username || "N/A"}</td>
                    <td className="px-4 py-2">${order.totalPrice?.toFixed(2) || "0.00"}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        order.status === "delivered" ? "bg-green-100 text-green-800" :
                        order.status === "shipped" ? "bg-blue-100 text-blue-800" :
                        order.status === "processing" ? "bg-yellow-100 text-yellow-800" :
                        order.status === "cancelled" ? "bg-red-100 text-red-800" :
                        "bg-gray-100 text-gray-800"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-4 py-2 text-center">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminHomePage;
