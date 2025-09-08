import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createCheckout } from "../../redux/slices/checkoutSlice";
import { toast } from "sonner";
import axios from "axios";
import { createOrder } from "../../redux/slices/orderSlice";
import { clearCart, clearCartFromBackend } from "../../redux/slices/cartSlice";

const Checkout = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { cart, loading, error } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const [checkoutId, setcheckoutId] = useState(() => {
    const savedCheckoutId = localStorage.getItem("checkoutId");
    return savedCheckoutId || null;
  });
  const [shippingAddress, setShippingAddress] = useState({
    firstname: "",
    lastname: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  useEffect(() => {
    if (!user) {
      navigate("/login?redirect=checkout");
      return;
    }
    // Only redirect to cart if there are no products and we're not in the payment process
    if (cart.products.length === 0 && !checkoutId) {
      navigate("/");
    }
  }, [user, cart.products, navigate, checkoutId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate shipping address
    const requiredFields = [
      "firstname",
      "lastname",
      "address",
      "city",
      "postalCode",
      "country",
      "phone",
    ];
    const missingFields = requiredFields.filter(
      (field) => !shippingAddress[field]
    );

    if (missingFields.length > 0) {
      toast.error(
        `Please fill in all required fields: ${missingFields.join(", ")}`
      );
      return;
    }

    try {
      // Create checkout session first
      const result = await dispatch(
        createCheckout({
          CheckoutItems: cart.products.map((item) => ({
            productId: item.productId._id || item.productId,
            name: item.name,
            image: item.image,
            price: item.price,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
          })),
          shippingAddress: `${shippingAddress.firstname} ${shippingAddress.lastname}, ${shippingAddress.address}`,
          city: shippingAddress.city,
          postalCode: shippingAddress.postalCode,
          country: shippingAddress.country,
          paymentMethod: "Paypal",
          totalPrice: cart.totalPrice,
        })
      ).unwrap();

      if (result._id) {
        setcheckoutId(result._id);
        localStorage.setItem("checkoutId", result._id);
        toast.success("Checkout created successfully");
        // Now proceed with payment
        handlePaymentSuccess({
          transactionId: `PAY-${Date.now()}`,
        });
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error(error.message || "Failed to create checkout");
    }
  };

  const handlePaymentSuccess = async (paymentResult) => {
    try {
      const token = JSON.parse(localStorage.getItem("UserToken"));
      if (!token) {
        toast.error("Authentication token not found");
        navigate("/login");
        return;
      }

      const currentCheckoutId =
        checkoutId || localStorage.getItem("checkoutId");
      if (!currentCheckoutId) {
        toast.error("Checkout session not found. Please try again.");
        return;
      }

      // First finalize the checkout
      const checkoutResponse = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/checkout/${currentCheckoutId}/pay`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            paymentStatus: "paid",
            paymentDetails: {
              status: "completed",
              transactionId: paymentResult.transactionId,
              paymentMethod: "PayPal",
            },
          }),
        }
      );

      if (!checkoutResponse.ok) {
        const errorData = await checkoutResponse.json();
        throw new Error(errorData.message || "Failed to finalize checkout");
      }

      // Create order data
      const orderData = {
        orderItems: cart.products.map((item) => ({
          productId: item.productId._id || item.productId,
          name: item.name,
          quantity: item.quantity,
          image: item.image,
          price: item.price,
          size: item.size,
          color: item.color,
        })),
        shippingAddress: {
          firstname: shippingAddress.firstname,
          lastname: shippingAddress.lastname,
          address: shippingAddress.address,
          city: shippingAddress.city,
          postalCode: shippingAddress.postalCode,
          country: shippingAddress.country,
          phone: shippingAddress.phone,
        },
        paymentMethod: "PayPal",
        totalPrice: cart.totalPrice,
        paymentDetails: {
          status: "completed",
          transactionId: paymentResult.transactionId,
          paymentMethod: "PayPal",
        },
      };

      // Create the order
      const result = await dispatch(createOrder(orderData)).unwrap();

      // Clear the cart from backend first
      await dispatch(clearCartFromBackend({ userId: user._id })).unwrap();

      // Then clear the cart in Redux store and localStorage
      dispatch(clearCart());

      // Clear the checkout ID from localStorage
      localStorage.removeItem("checkoutId");

      // Navigate to order confirmation
      navigate("/order-confirmation");
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(error.message || "Payment failed. Please try again.");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  if (error) return <p>Error: {error}</p>;
  if (!cart || !cart.products || cart.products.length === 0) {
    return <p>Your cart is empty</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl p-4 mx-auto">
      {/* Left side - Form */}
      <div className="p-4 order-2 md:order-1">
        <h1 className="uppercase text-2xl tracking-tighter m">checkout</h1>
        <h1 className="text-lg mb-2">Contact Details</h1>
        <form onSubmit={handleSubmit}>
          <label className="text-gray-600 text-lg block">Email</label>
          <input
            type="text"
            value={user ? user.email : ""}
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
          {!checkoutId ? (
            <button
              type="submit"
              className="bg-black text-lg font-semibold hover:bg-gray-800 w-full text-white py-3 rounded"
            >
              Proceed to Payment
            </button>
          ) : (
            <div className="mt-4">
              <button
                type="submit"
                disabled
                className="bg-black text-lg font-semibold hover:bg-gray-800 w-full text-white py-3 rounded"
              >
                Processing the payment
              </button>
            </div>
          )}
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
          <span>${cart.totalPrice.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
