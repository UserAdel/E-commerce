import React from "react";
import { useState } from "react";

const EditProductPage = () => {
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: 0,
    countInStock: 0,
    sku: "",
    category: "",
    brand: "",
    sizes: [],
    colors: [],
    collections: "",
    material: "",
    gender: "",
    images: [
      {
        url: "https://picsum.photos/150?random=1",
      },
      {
        url: "https://picsum.photos/150?random=2",
      },
    ],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    console.log(file);
  };

  const handleFormSubmit =(e) => {
    e.preventDefault();
    //API call to save the product data
    console.log("Product data submitted:", productData);
  }

  return (
    <div className="max-w-5xl mx-auto p-6 shadow-md rounded-md">
      <h2 className="text-3xl font-bold mb-6"></h2>
      <form onSubmit={handleFormSubmit}>
        {/* Name */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Product Name</label>
          <input
            type="text"
            name="name"
            value={productData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>
        {/* Description */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Description</label>
          <textarea
            name="description"
            value={productData.description}
            className="w-full border border-gray-300 rounded-md p-2"
            rows={4}
            onChange={handleChange}
            required
          />
        </div>
        {/* Price */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Price</label>
          <input
            type="number"
            name="price"
            value={productData.price}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        {/* Count In Stock */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Count in Stock</label>
          <input
            type="number"
            name="countInStock"
            value={productData.countInStock}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        {/* SKU */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Count in Stock</label>
          <input
            type="text"
            name="sku"
            value={productData.sku}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        {/* SIZE */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">
            Size (comma-seprated)
          </label>
          <input
            type="text"
            name="sizes"
            value={productData.sizes.join(",")}
            onChange={(e) => {
              setProductData({
                ...productData,
                sizes: e.target.value.split(",").map((size) => size.trim()),
              });
            }}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        {/* color */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">
            Color (comma-separated)
          </label>
          <input
            type="text"
            name="colors"
            value={productData.colors.join(",")}
            onChange={(e) => {
              setProductData({
                ...productData,
                colors: e.target.value.split(",").map((color) => color.trim()),
              });
            }}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        {/* image upload */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Upload Image </label>
          <input type="file" onChange={handleImageUpload} />
          <div className="flex gap-4 mt-4">
            {productData.images.map((image, index) => (
              <img
                key={index}
                src={image.url}
                alt={image.altText || "Product Image"}
                draggable="false"
                className="w-20 h-20 object-cover rounded-md shadow-md "
              />
            ))}
          </div>
        </div>
        <button className="bg-green-500 w-full text-white px-4 py-2 rounded-md hover:bg-green-600">
          Save Changes </button>
      </form>
    </div>
  );
};

export default EditProductPage;
