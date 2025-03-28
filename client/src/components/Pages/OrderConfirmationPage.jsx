import React from 'react';
import { useParams } from 'react-router-dom';

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
    }
  ],
  shippingAddress: {
    addressLine1: "123 Main St",
    city: "New York",
    country: "USA",
    postalCode: "10001"
  },

};

const OrderConfirmationPage = () => {

  
  return (
    <div className=" ">  </div>
  );
};

export default OrderConfirmationPage;
