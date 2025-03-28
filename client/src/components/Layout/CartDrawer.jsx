import React from "react";
import { IoMdClose } from "react-icons/io"; // Import the close icon
import CartContent from "../Cart/CartContent";
import { useNavigate } from "react-router-dom";



const CartDrawer = ({ isCartOpen, toggleCart }) => {
const navigate = useNavigate();
  const handelcheckout = () => {
    toggleCart();
    navigate("/checkout");
  }

  return (
    <div
      className={`fixed right-0 top-0 w-3/4 sm:w-1/2 md:w-1/2 lg:w-1/4 h-full bg-white shadow-lg transform transition-transform duration-300 flex flex-col z-50 ${
        isCartOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="font-bold text-2xl">Your Cart</h3>
        <button onClick={toggleCart}>
          <IoMdClose className="h-6 w-6 text-gray-600" />
        </button>
      </div>
      <div className="flex-grow overflow-y-auto p-4">
        
        <CartContent />
      </div>

      <div className="bg-white p-4 sticky bottom-0">
        <button onClick={handelcheckout} className="w-full bg-black text-white rounded-lg py-3 font-semibold hover:bg-gray-800">
          Checkout
        </button>
        <p className="text-sm tracking-tighter text-gray-500 mt-2 text-center">
          Shipping, taxes, and discount codes calculated at checkout
        </p>
      </div>
    </div>
  );
};

export default CartDrawer;
