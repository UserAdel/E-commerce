import React from "react";
import { FaTrashAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  updateCartItemQuantity,
  removeFromCart,
} from "../../redux/slices/cartSlice";
import { toast } from "sonner";

const CartContent = ({ cart, userId, guestId }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.cart);

  const handleAddToCart = (productId, delta, quantity, size, color) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1) {
      dispatch(
        updateCartItemQuantity({
          productId,
          quantity: newQuantity,
          size,
          color,
          userId,
          guestId,
        })
      );
    }
  };

  const handleRemoveItem = (productId, size, color) => {
    dispatch(
      removeFromCart({
        productId,
        size,
        color,
        userId,
        guestId,
      })
    ).catch((error) => {
      toast.error(error.message || "Failed to remove product");
    });
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!cart?.products?.length) {
    return <p className="text-center py-4">Your cart is empty</p>;
  }

  return (
    <div>
      {cart.products.map((product) => (
        <div
          key={`${product.productId}-${product.size}-${product.color}`}
          className="flex justify-between items-center border-b py-4"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-16 h-16 object-cover rounded"
          />
          <div className="flex-1 px-4">
            <h4 className="font-medium">{product.name}</h4>
            <p className="text-sm text-gray-500">
              Size: {product.size} | Color: {product.color}
            </p>
            <div className="md:flex items-center mt-2">
              <button
                className="text-gray-500 border border-solid px-2 py-1"
                onClick={() =>
                  handleAddToCart(
                    product.productId,
                    -1,
                    product.quantity,
                    product.size,
                    product.color
                  )
                }
              >
                -
              </button>
              <span className="px-2 pt-1">{product.quantity}</span>
              <button
                className="text-gray-500 border border-solid px-2 py-1"
                onClick={() =>
                  handleAddToCart(
                    product.productId,
                    +1,
                    product.quantity,
                    product.size,
                    product.color
                  )
                }
              >
                +
              </button>
            </div>
          </div>

          <div className="text-right">
            <div>
              <p className="font-semibold">${product.price.toLocaleString()}</p>
            </div>
            <button
              className="pr-2 mt-2"
              onClick={() =>
                handleRemoveItem(product.productId, product.size, product.color)
              }
            >
              <FaTrashAlt className="w-6 h-6" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartContent;
