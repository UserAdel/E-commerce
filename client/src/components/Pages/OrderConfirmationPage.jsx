import React from "react";
import { useParams } from "react-router-dom";

// Sample order data (this would normally come from an API)
const orderData = {
  _id: "1",
  createdAt: new Date(),
  checkoutItems: [
    {
      productId: "1",
      name: "Stylish Jacket",
      color: "Black",
      size: "M",
      price: 120,
      image: "https://picsum.photos/150?random=1",
    },
    {
      productId: "2",
      name: "Casual Sneakers",
      color: "White",
      size: "42",
      price: 75,
      image: "https://picsum.photos/150?random=2",
    },
  ],
  shippingAddress: {
    addressLine1: "123 Main St",
    city: "New York",
    country: "USA",
    postalCode: "10001",
  },
};

const CalculateEstmatedTime = (createdAt) => {
  const currentDate = new Date();
  const timeDiff = currentDate - createdAt;
  const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const estimatedDeliveryDate = new Date(createdAt);
  estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 7);
  return estimatedDeliveryDate.toLocaleDateString();
};

const OrderConfirmationPage = () => {
  return (
    <>
      <h1 className="text-4xl font-bold text-emerald-900  mb-8 mt-4 text-center">
        Thank You For Your Order
      </h1>
      <div className="max-w-4xl mx-auto mb-10 p-4 border">
        <div className="flex justify-between">
          <div className=" ">
            <h1 className="text-xl font-bold mb-1">
              Order ID: {orderData._id}
            </h1>
            <h2 className="text-gray-600">
              Order date: {orderData.createdAt.toLocaleDateString()}
            </h2>
          </div>
          <h2 className="text-gray-600">
            Estimated Delivery : {CalculateEstmatedTime(orderData.createdAt)}
          </h2>
        </div>

        <div className="p-4 mt-4 border-t-4 border-emerald-900">
       
          {orderData.checkoutItems.map((item) => (
            <div key={item.productId} className=" flex justify-between border-b mt-10">
              <div className="flex items-center mb-4">
              <img src={item.image} alt={item.name} className="w-16 bg-cover h-16 mr-4 " />
              <div>
                <h3 className="font-bold">{item.name}</h3>
                <p className="text-gray-600">
                  {item.color}, Size: {item.size}
                </p>
              </div>
            </div>
            <div>
            <p className="text-gray-800 text-lg pt-6 pr-4 ">${item.price}</p>
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
          <h1 className="text-lg text-gray-500">{orderData.shippingAddress.addressLine1} <br />
          {orderData.shippingAddress.city}, {orderData.shippingAddress.country} 
          </h1>
        </div>
        </div>
      </div>
    </>
  );
};

export default OrderConfirmationPage;
