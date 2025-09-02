import React from "react";
import login from "../../assets/login.webp";
import { useState } from "react";
import { Link, redirect, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/slices/authSlice";
import { mergeCart } from "../../redux/slices/cartSlice";
import { useEffect } from "react";
import { toast } from "sonner";

const Login = () => {
  const { loading, error } = useSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, guestId } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);

  const redirect = new URLSearchParams(location.search).get("redirect") || "/";
  const isCheckoutRedirect = redirect.includes("checkout");

  useEffect(() => {
    if (user) {
      const token = JSON.parse(localStorage.getItem("UserToken"));
      if (!token) {
        console.error("No token available for cart operations");
        toast.error("Authentication error. Please try logging in again.");
        return;
      }

      if (cart?.products?.length > 0 && guestId) {
        console.log("Merging cart with user:", user);
        dispatch(mergeCart({ guestId, user }))
          .then(() => {
            navigate(isCheckoutRedirect ? "/checkout" : "/");
          })
          .catch((error) => {
            console.error("Error merging cart:", error);
            toast.error("Failed to merge cart. Your items are still saved.");
            navigate(isCheckoutRedirect ? "/checkout" : "/");
          });
      } else {
        navigate(isCheckoutRedirect ? "/checkout" : "/");
      }
    }
  }, [user, guestId, cart, navigate, isCheckoutRedirect, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="flex">
      <div className="md:w-1/2 w-full flex justify-center items-center ">
        <form
          onSubmit={submitHandler}
          className="flex flex-col border shadow-md p-10 w-full max-w-md rounded-md"
        >
          <h2 className="text-xl text-center mb-4">Rabbit</h2>
          <h1 className="text-3xl font-bold mb-4 text-center">Hey there!</h1>
          <h1 className="text-lg text-gray-800 mb-4 font-semibold text-center">
            Enter your email and password to login
          </h1>
          <label htmlFor="email" className="mb-4">
            Email
          </label>
          <input
            type="email"
            placeholder="enter your email"
            className="border p-2 mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="password" className="mb-4">
            Password
          </label>
          <input
            type="password"
            placeholder="enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 mb-4"
            required
          />

          <button
            type="submit"
            className="bg-black mt-4 text-white p-2 rounded"
            disabled={loading}
          >
            {loading ? "Loading..." : "Login"}
          </button>

          <div className="flex justify-center items-center mt-4">
            <h1 className="text-gray-600 text-center text-lg">
              don't have an account?{" "}
            </h1>
            <Link
              to={`/register?redirect=${encodeURIComponent(redirect)}`}
              className="text-blue-500 hover:underline ml-1"
            >
              Register
            </Link>
          </div>
        </form>
      </div>

      {/* image section */}
      <div className="w-1/2 hidden md:flex">
        <img src={login} alt="" className="h-[750px] w-full object-cover" />
      </div>
    </div>
  );
};

export default Login;
