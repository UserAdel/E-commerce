import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrdersDetails } from "../../redux/slices/orderSlice";
import { toast } from "sonner";

const OrderDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { orderDetails, loading, error } = useSelector((state) => state.order);

  useEffect(() => {
    if (!id) {
      toast.error("Order ID not found");
      return;
    }
    dispatch(fetchOrdersDetails(id));
  }, [dispatch, id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading order details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-500">No order details found</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <h2 className="text-2xl md:text-3xl font-bold mb-6">Order Details</h2>
      <div className="p-4 sm:p-6 rounded-lg border">
        {/* Order Info */}
        <div className="flex flex-col sm:flex-row justify-between mb-8">
          <div>
            <h3 className="text-lg md:text-xl font-semibold">
              Order ID: #{orderDetails._id}
            </h3>
            <p className="text-gray-600">
              {new Date(orderDetails.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex flex-col items-start sm:items-end mt-4 sm:mt-0">
            <span
              className={`${
                orderDetails.isPaid
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              } px-3 py-1 rounded-full text-sm font-medium mb-2`}
            >
              {orderDetails.isPaid ? "Paid" : "Pending"}
            </span>

            <span
              className={`${
                orderDetails.isDelivered
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              } px-3 py-1 rounded-full text-sm font-medium mb-2`}
            >
              {orderDetails.isDelivered ? "Delivered" : "Pending Delivery"}
            </span>
          </div>
        </div>

        {/* Customer, Payment, Shipping Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h4 className="text-lg font-semibold mb-2">Payment Info</h4>
            <p>Payment Method: {orderDetails.paymentMethod}</p>
            <p>Status: {orderDetails.isPaid ? "Paid" : "Unpaid"}</p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-2">Shipping Info</h4>
            <p>Shipping Method: {orderDetails.shippingMethod}</p>
            <p>
              Address:{" "}
              {`${orderDetails.shippingAddress.city}, ${orderDetails.shippingAddress.country}`}
            </p>
          </div>
        </div>

        {/* Product List */}
        <div className="overflow-auto">
          <h4 className="text-lg font-semibold mb-4">Products</h4>
          <table className="min-w-full text-gray-600 mb-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Unit Price</th>
                <th className="px-4 py-2 text-left">Quantity</th>
                <th className="px-4 py-2 text-left">Total</th>
              </tr>
            </thead>
            <tbody>
              {orderDetails.orderItems.map((item) => (
                <tr key={item.productId}>
                  <td className="px-4 py-2 flex items-center gap-2">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-16 w-16 object-cover rounded"
                    />
                    <Link
                      to={`/product/${item.productId}`}
                      className="text-blue-500 hover:underline mr-10 md:mr-0"
                    >
                      {item.name}
                    </Link>
                  </td>
                  <td className="px-4 py-2">${item.price}</td>
                  <td className="px-8 py-2">{item.quantity}</td>
                  <td className="px-4 py-2">${item.price * item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Link
          to="/my-orders"
          className="text-blue-500 hover:underline mt-4 inline-block"
        >
          Back to My Orders
        </Link>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
