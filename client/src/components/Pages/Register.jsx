import React from "react";
import login from "../../assets/login.webp";
import { useState } from "react";
import { Link } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const submitHanler = (e) => {
    e.preventDefault();
    console.log("submitted");
    console.log(email, password, username);
  };
  return (
    <div className="flex">
      <div className="md:w-1/2 w-full flex justify-center items-center ">
        <form
          onSubmit={submitHanler}
          className="flex flex-col border  shadow-md p-10 w-full max-w-md rounded-md"
        >
          <h2 className="text-xl text-center mb-4">Rabbit</h2>
          <h1 className="text-3xl font-bold mb-4 text-center"> Hey there! </h1>
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
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="text" className="mb-4">
            
            Username
          </label>
          <input
            type="text"
            placeholder="enter your username"
            className="border p-2 mb-4"
            onChange={(e) => setUsername(e.target.value)}
          />

          <label htmlFor="password" className="mb-4">
            {" "}
            Password
          </label>
          <input
            type="password"
            placeholder="enter your password "
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 mb-4"
          />
          <button
            type="submit"
            className="bg-black mt-4 text-white p-2 rounded"
          >
            Register
          </button>

          <div className="flex justify-center items-center  mt-4">
            <h1 className=" text-gray-600 text-center text-lg">
              {" "}
              Already have an account?{" "}
            </h1>
            <Link to="/Login" className="text-blue-500 hover:underline ml-1">
              {" "}
              login
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

export default Register;
