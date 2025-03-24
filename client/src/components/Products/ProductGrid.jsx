import React from "react";
import { Link } from "react-router-dom";

const ProductGrid = ({ products }) => {
  // Handle empty or undefined products
  if (!products || products.length === 0) {
    return (
      <div className="w-full py-8 text-center">
        <p className="text-xl text-gray-600">No products found</p>
      </div>
    );
  }

  return (
    <div className=" container mx-auto grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product, index) => (
        <Link key={index} to={`/product/${product._id}`} className="block">
          <div className="bg-white p-4 rounded-lg  ">
            <div className="h-96 md:w-full sm:w-1/2 mb-4">
            <img src={product.images[0].url} alt="product image" 
          className='w-full h-full object-cover rounded-lg'
          />
            </div>
            <div className="text-gray-500">
            <h4 className="text-sm font-medium mb-1">{product.name}</h4>
            <p className="text-lg font-medium tracking-tighter">${product.price}</p>
            </div>

          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProductGrid;
