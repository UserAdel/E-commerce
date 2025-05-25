import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
const AdminHomePage = () => {
  const dispatch = useDispatch();
  const {
    products,
    loading: productsLoading,
    error: productsError,
  } = useSelector((state) => state.adminProducts);

  const {
    orders,
    totalOrders,
    totalSales,
    loading: ordersLoading,
    error: ordersError,
  } = useSelector((state) => state.adminOrders);

  useEffect(() => {
    dispatch(fetchAdminProducts());
    dispatch(fetchAllOrders());
  },[dispatch]);



  return (
    <div className="max-w-5xl mx-auto p-6 ">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard </h1>
  {productsLoading || ordersLoading ? (
    <p>Loading ...</p>
) : productsError ? (
    <p className="Text-red-500">Error fetching products: {productsError}</p>
) : ordersError ? (
    <p className="Text-red-500">Error fetching orders: {ordersError}</p>
) : (
      <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="flex flex-col border shadow-b-gray-200 rounded-lg p-4 shadow-md">
          <h2 className="text-2xl font-semibold">Revenue </h2>
          <p className="text-xl font-medium">${totalSales.tofixed(2)}</p>
        </div>
        <div className="flex flex-col border shadow-b-gray-200 rounded-lg p-4 shadow-md ">
          <h2 className="text-2xl font-semibold">Total Orders </h2>
          <p className="text-xl font-medium">${totalOrders}</p>
          <Link to="/admin/orders" className="text-blue-500 hover:underline">
            Manage Orders
          </Link>
        </div>
        <div className="flex flex-col border shadow-b-gray-200 rounded-lg p-4 shadow-md ">
          <h2 className="text-2xl font-semibold">Total Products </h2>
          <p className="text-xl font-medium">{products.length}</p>
          <Link to="/admin/products" className="text-blue-500 hover:underline">
            Manage Products
          </Link>
        </div>
      </div>
  

)}
  
      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-4"> Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full overflow-auto  ">
            <thead className="bg-gray-200 text-gray-700  ">
              <th className="bg-gray-200 text-gray-700 px-4 py-2">ORDER ID</th>
              <th className="bg-gray-200 text-gray-700 px-4 py-2">USER</th>
              <th className="bg-gray-200 text-gray-700 px-4 py-2">
                TOTAL PRICE
              </th>
              <th className="bg-gray-200 text-gray-700 px-4 py-2">STATUS</th>
            </thead>

            <tbody className="bg-white shadow-md text-center text-gray-700">
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b text-gray-500 hover:bg-gray-100"
                >
                  <th className="px-4 py-2">{order._id}</th>
                  <th className="px-4 py-2">{order.user.name}</th>
                  <th className="px-4 py-2">{order.totalPrice.tofixed(2)}</th>
                  <th className="px-4 py-2">{order.status}</th>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminHomePage;
