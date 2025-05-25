import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../../redux/slices/cartSlice";

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
  const checkout = useSelector((state) => state.checkout);

  useEffect(() => {
    if (checkout && checkout._id) {
      dispatch(clearCart());
      localStorage.removeItem("cart");
    } else {
      navigate("my-order");
    }
  }, [checkout, dispatch, navigate]);

  return (
    <>
      <h1 className="text-4xl font-bold text-emerald-900  mb-8 mt-4 text-center">
        Thank You For Your Order
      </h1>
      <div className="max-w-4xl mx-auto mb-10 p-4 border">
        <div className="flex justify-between">
          <div className=" ">
            <h1 className="text-xl font-bold mb-1">Order ID: {checkout._id}</h1>
            <h2 className="text-gray-600">
              Order date: {checkout.createdAt.toLocaleDateString()}
            </h2>
          </div>
          <h2 className="text-gray-600">
            Estimated Delivery : {CalculateEstmatedTime(checkout.createdAt)}
          </h2>
        </div>

        <div className="p-4 mt-4 border-t-4 border-emerald-900">
          {checkout.checkoutItems.map((item) => (
            <div
              key={item.productId}
              className=" flex justify-between border-b mt-10"
            >
              <div className="flex items-center mb-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 bg-cover h-16 mr-4 "
                />
                <div>
                  <h3 className="font-bold">{item.name}</h3>
                  <p className="text-gray-600">
                    {item.color}, Size: {item.size}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-gray-800 text-lg pt-6 pr-4 ">
                  ${item.price}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between px-10 py-2">
          <div className=" flex-col">
            <h1 className="text-lg font-bold">Payment</h1>
            <h1 className="text-lg text-gray-500">PayPal</h1>
          </div>
          <div className=" flex-col">
            <h1 className="text-lg font-bold">Delivery</h1>
            <h1 className="text-lg text-gray-500">
              {checkout.shippingAddress.addressLine1} <br />
              {checkout.shippingAddress.city},{" "}
              {checkout.shippingAddress.country}
            </h1>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderConfirmationPage;
