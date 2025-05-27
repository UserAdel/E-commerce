import React from "react";
import featured from "../../assets/featured.webp";
import { Link } from "react-router-dom";

const FeaturedCollection = () => {
  return (
    <section className="py-16 px-4 lg:px-0">
      <div className="container mx-auto flex flex-col-reverse md:flex-row items-center bg-green-50 rounded-3xl overflow-hidden">
        <div className="lg:w-1/2 p-8 text-center lg:text-left"> 
          <h2 className="text-2xl font-bold mb-2 text-gray-700">Comfort and Style</h2>
          <h1 className="text-5xl mb-4 font-bold"> Apparel made for your everyday life</h1>
          <h2 className="text-lg tracking-tighter mb-6 text-gray-600"> Discover high-quality, comfortable clothing that effortlessly blends fashion and function. Designed to make you look and feel great every day.</h2>
       <Link to="/collections/all">
       <button className="bg-black text-white rounded-lg text-lg px-6 py-3 hover:bg-gray-800 "> Shop now</button>
       </Link>

        </div>
        <div className="lg:w-1/2  ">
          <img src={featured} alt="Featured Image" className="w-full object-cover h-full lg:rounded-tr-3xl lg:rounded-br-3xl" />
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollection;
