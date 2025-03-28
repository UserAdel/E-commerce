import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const cart = {
  products: [
    {
      name: "Stylish Jacket",
      size: "M",
      color: "Black",
      price: 120,
      image: "https://picsum.photos/150?random=1",
    },
    {
      name: "Casual Sneakers",
      size: "42",
      color: "White",
      price: 75,
      image: "https://picsum.photos/150?random=2",
    },
  ],
  totalPrice: 195,
};

const Checkout = () => {
//  const navigate = useNavigate();
  const [checkoutid, setCheckoutid] = useState(null);
  const [shippingAddress, setShippingAddress] = useState({
    firstname: "",
    lastname: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  const Handelcheckoutsubmit = (e) => {
    e.preventDefault();
    console.log("Shipping address:", shippingAddress);
    setCheckoutid(1234);
    // navigate("/payment");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl p-4 mx-auto">
      {/* Left side - Form */}
      <div className="p-4 order-2 md:order-1">
        <h1 className="uppercase text-2xl tracking-tighter m ">checkout</h1>
        <h1 className="text-lg mb-2">Contact Details</h1>
        <form onSubmit={Handelcheckoutsubmit}>
          <label className="text-gray-600 text-lg block">Email</label>
          <input
            type="text"
            value="Admin@exapmle.com"
            className="border p-2 mb-2 w-full rounded"
            disabled={true}
          />

          <h1 className="text-lg mb-2">Delivery</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
            <div className="">
              <label className="text-gray-600 text-lg block">First name</label>
              <input
                type="text"
                className="border p-2 w-full rounded"
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    firstname: e.target.value,
                  })
                }
                value={shippingAddress.firstname}
              />
            </div>
            <div className="">
              <label className="text-gray-600 text-lg block">Last name</label>
              <input
                type="text"
                className="border p-2 mb-2 w-full rounded"
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    lastname: e.target.value,
                  })
                }
                value={shippingAddress.lastname}
              />
            </div>
          </div>

          <label className="text-gray-600 text-lg block">Address</label>
          <input
            type="text"
            className="border p-2 mb-2 w-full rounded"
            onChange={(e) =>
              setShippingAddress({
                ...shippingAddress,
                address: e.target.value,
              })
            }
            value={shippingAddress.address}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
            <div className="">
              <label className="text-gray-600 text-lg block">City</label>
              <input
                type="text"
                className="border p-2 w-full rounded"
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    city: e.target.value,
                  })
                }
                value={shippingAddress.city}
              />
            </div>
            <div className="">
              <label className="text-gray-600 text-lg block">Postal Code</label>
              <input
                type="text"
                className="border p-2 mb-2 w-full rounded"
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    postalCode: e.target.value,
                  })
                }
                value={shippingAddress.postalCode}
              />
            </div>
          </div>

          <label className="text-gray-600 text-lg block">Country</label>
          <input
            type="text"
            className="border p-2 mb-2 w-full rounded"
            onChange={(e) =>
              setShippingAddress({
                ...shippingAddress,
                country: e.target.value,
              })
            }
            value={shippingAddress.country}
          />

          <label className="text-gray-600 text-lg block">Phone</label>
          <input
            type="text"
            className="border p-2 w-full rounded mb-4"
            onChange={(e) =>
              setShippingAddress({ ...shippingAddress, phone: e.target.value })
            }
            value={shippingAddress.phone}
          />

          <button
            type="submit"
            className="bg-black text-lg font-semibold  hover:bg-gray-800 w-full text-white py-3 rounded"
          >
            Continue to Payment
          </button>
        </form>
      </div>

      {/* Right side - Order summary */}
      <div className="bg-green-50 p-4 rounded-lg shadow-md order-1 md:order-2">
        <h1 className="border-b-2 font-semibold text-lg pb-3 mx-4 p-2">
          Order Summary
        </h1>
        {cart.products.map((product, index) => (
          <div
            key={index}
            className="flex items-center justify-between border-b-2 pb-4 mb-4 p-2"
          >
            <div className="ml-4 flex flex-row items-center space-x-3">
              <img
                src={product.image}
                alt={product.name}
                className="w-16 h-16 rounded"
              />
              <div className="flex flex-col">
                <h2 className="text-lg font-semibold">{product.name}</h2>
                <p className="text-gray-600">Size: {product.size}</p>
                <p className="text-gray-600">Color: {product.color}</p>
              </div>
            </div>
            <p className="text-lg font-semibold">${product.price}</p>
          </div>
        ))}

        {/* Added total price summary */}
        <div className="flex justify-between p-4 font-bold text-lg">
          <span>Total:</span>
          <span>${cart.totalPrice}</span>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
