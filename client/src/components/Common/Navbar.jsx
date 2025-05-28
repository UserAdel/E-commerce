import React, { useState } from "react";
import { Link } from "react-router-dom";
import { HiOutlineUser, HiOutlineShoppingBag } from "react-icons/hi";
import { HiBars3BottomRight } from "react-icons/hi2";
import SearchBar from "./SearchBar";
import CartDrawer from "../Layout/CartDrawer";
import { BiX } from "react-icons/bi";
import { useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";

const selectCart = (state) => state.cart.cart;
const selectUser = (state) => state.auth.user;

const selectCartItemCount = createSelector(
  [selectCart],
  (cart) => cart?.products?.reduce((total, product) => total + product.quantity, 0) || 0
);

const Navbar = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const [navDrawer, setNavDrawer] = useState(false);
  const { cart } = useSelector((state) => state.cart);
  const user = useSelector(selectUser);
  const cartItemCount = useSelector(selectCartItemCount);

  const toggleNavDrawer = () => {
    setNavDrawer(!navDrawer);
  };

  return (
    <div className="container mx-auto py-1 relative">
      <div className="flex justify-between items-center md:h-16">
        <div>
          <Link className="font-bold text-2xl py-5" to="/">
            Rabbit
          </Link>
        </div>

        <div className="flex justify-between items-center space-x-6 font-bold text-1xl">
          <Link
            to="/collections/all?gender=Men"
            className="text-gray-600 hover:text-gray-800 hidden md:block"
          >
            MEN
          </Link>
          <Link
            to="/collections/all?gender=Women"
            className="text-gray-600 hover:text-gray-800 hidden md:block"
          >
            WOMAN
          </Link>
          <Link
            to="/collections/all?category=Top Wear"
            className="text-gray-600 hover:text-gray-800 hidden md:block"
          >
            TOP WEAR
          </Link>
          <Link
            to="/collections/all?category=Bottom Wear"
            className="text-gray-600 hover:text-gray-800 hidden md:block"
          >
            BOTTOM WEAR
          </Link>
        </div>

        <div className="flex justify-between items-center space-x-3">
          {user && user.role === "admin" && (
            <Link
              to="/admin"
              className="block bg-black rounded text-white px-2 text-sm py-1 hover:bg-gray-800"
            >
              Admin
            </Link>
          )}

          <Link to="/profile">
            <HiOutlineUser className="w-6 h-6" />
          </Link>
          <button className="relative" onClick={toggleCart}>
            <HiOutlineShoppingBag className="w-6 h-6" />
            {cartItemCount > 0 && (
              <span className="rounded-full bg-red-800 px-2 py-0.5 absolute -top-1 -right-1 text-xs w-4 h-4 flex items-center justify-center text-white">
                {cartItemCount}
              </span>
            )}
          </button>
          <div className="overflow-hidden">
            <SearchBar />
          </div>
          <button onClick={toggleNavDrawer}>
            <HiBars3BottomRight className="w-6 h-6 md:hidden" />
          </button>
        </div>
      </div>

      <CartDrawer isCartOpen={isCartOpen} toggleCart={toggleCart} />

      <div
        className={`fixed top-0 left-0 w-3/4 h-full bg-white z-50 transform transition-transform duration-300 ${
          navDrawer ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 flex justify-end">
          <button onClick={toggleNavDrawer}>
            <BiX className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 ">
          <h1 className="font-bold text-4xl mb-6">Menu</h1>
          <nav className="space-y-2 flex-col flex">
            <Link
              to="/collections/all?gender=Men"
              onClick={toggleNavDrawer}
              className="text-gray-600 font-semibold text-2xl hover:text-black py-2"
            >
              Men
            </Link>
            <Link
              to="/collections/all?gender=Women"
              onClick={toggleNavDrawer}
              className="text-gray-600 font-semibold text-2xl hover:text-black py-2"
            >
              Woman
            </Link>
            <Link
              to="/collections/all?category=Top Wear"
              onClick={toggleNavDrawer}
              className="text-gray-600 font-semibold text-2xl hover:text-black py-2"
            >
              Top Wear
            </Link>
            <Link
              to="/collections/all?category=Bottom Wear"
              onClick={toggleNavDrawer}
              className="text-gray-600 font-semibold text-2xl hover:text-black py-2"
            >
              Bottom Wear
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
