import React from 'react';
import { FaTrashAlt } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { updateCartItemQuantity, removeFromCart } from '../../redux/slices/cartSlice';
import { toast } from 'sonner';

const CartContent = () => {
  const dispatch = useDispatch();
  const { cart, loading } = useSelector((state) => state.cart);
  const { user, guestId } = useSelector((state) => state.auth);

  const handleQuantityChange = (productId, size, color, newQuantity) => {
    if (newQuantity < 1) return;
    
    dispatch(updateCartItemQuantity({
      productId,
      quantity: newQuantity,
      size,
      color,
      userId: user?.id,
      guestId
    })).catch((error) => {
      toast.error(error.message || "Failed to update quantity");
    });
  };

  const handleRemoveItem = (productId, size, color) => {
    dispatch(removeFromCart({
      productId,
      size,
      color,
      userId: user?.id,
      guestId
    })).catch((error) => {
      toast.error(error.message || "Failed to remove item");
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
      {cart.products.map((item) => (
        <div key={`${item.productId}-${item.size}-${item.color}`} className="flex justify-between items-center border-b py-4">
          <img 
            src={item.image} 
            alt={item.name} 
            className="w-16 h-16 object-cover rounded" 
          />
          <div className="flex-1 px-4">
            <h4 className="font-medium">{item.name}</h4>
            <p className="text-sm text-gray-500">Size: {item.size} | Color: {item.color}</p>
            <div className='md:flex items-center mt-2'>
              <button 
                className="text-gray-500 border border-solid px-2 py-1"
                onClick={() => handleQuantityChange(item.productId, item.size, item.color, item.quantity - 1)}
              >
                -
              </button>
              <span className="px-2 pt-1">{item.quantity}</span>
              <button 
                className="text-gray-500 border border-solid px-2 py-1"
                onClick={() => handleQuantityChange(item.productId, item.size, item.color, item.quantity + 1)}
              >
                +
              </button>
            </div>
          </div>

          <div className="text-right">
            <div>
              <p className="font-semibold">${item.price.toLocaleString()}</p>
            </div>
            <button 
              className='pr-2 mt-2'
              onClick={() => handleRemoveItem(item.productId, item.size, item.color)}
            >
              <FaTrashAlt className='w-6 h-6'/>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartContent;
