import React from "react";
import { useState } from "react";
import { toast } from "sonner";
import ProductGrid from "./ProductGrid";
import FeaturedCollection from "./FeaturedCollection";

const selectedProduct = {
  name: "Stylish Jacket",
  price: 120,
  originalPrice: 150,
  description: "This is a stylish Jacket perfect for any occasion",
  brand: "FashionBrand",
  material: "Leather",
  sizes: ["S", "M", "L", "XL"],
  colors: ["Red", "Black"],
  images: [
    {
      url: "https://picsum.photos/500/500?random=1",
      altText: "Stylish Jacket 1",
    },
    {
      url: "https://picsum.photos/500/500?random=2",
      altText: "Stylish Jacket 2",
    },
  ],
};

const similarProducts = [
  {
    _id: 1,
    name: "Product 1",
    price: 100,
    images: [{ url: "https://picsum.photos/500/500?random=2" }],
  },
  {
    _id: 2,
    name: "Product 2",
    price: 100,
    images: [{ url: "https://picsum.photos/500/500?random=3" }],
  },
  {
    _id: 3,
    name: "Product 3",
    price: 100,
    images: [{ url: "https://picsum.photos/500/500?random=4" }],
  }, {
    _id: 4,
    name: "Product 4",
    price: 100,
    images: [{ url: "https://picsum.photos/500/500?random=6" }],
  },
    ]

const ProductDetails = () => {
  const [mainImage, setMainImage] = useState(selectedProduct.images[0].url);
  const [selectedSizes, setselectedSizes] = useState(null);
  const [selectedColors, setselectedColors] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const HandleFormSubmit = () => {
    if (!selectedSizes || !selectedColors) {
      toast.error("Please select a size and color", { duration: 1000 });
      return;
    }
    setIsButtonDisabled(true);

    setTimeout(() => {
      toast.success("Item added to cart", { duration: 1000 });

      setIsButtonDisabled(false);
    }, 500);
  };

  console.log(selectedColors);
  console.log(selectedSizes);
  console.log(quantity);

  return (
    <div>
      <div className="container mx-auto max-w-4xl pt-8 flex flex-col md:flex-row w-full">
        <div className=" hidden md:flex flex-col mx-4">
          {selectedProduct.images.map((image, index) => (
            <img
              key={index}
              src={image.url}
              alt={image.altText}
              draggable="false"
              onClick={() => setMainImage(image.url)}
              className={`w-20 h-20 mb-4 rounded-lg ${
                mainImage === image.url ? "border-2 border-black" : ""
              }`}
            />
          ))}
        </div>
        <div className=" max-w-4xl ">
          <img
            src={mainImage}
            alt=" main image"
            draggable="false"
            className="object- rounded-lg"
          />
        </div>
        {/* Mobile Thumbnail */}
        <div className="md:hidden flex overscroll-x-scroll space-x-4 mb-4">
          {selectedProduct.images.map((image, index) => (
            <img
              key={index}
              src={image.url}
              onClick={() => setMainImage(image.url)}
              alt={image.altText || `Thumbnail ${index}`}
              className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${
                mainImage === image.url ? "border-2 border-black" : ""
              }`}
            />
          ))}
        </div>

        <div className=" w-1/2  text-gray-600 space-y-1 rounded-lg  pl-8  ">
          <h2 className="font-bold text-black text-3xl">
            {selectedProduct.name}
          </h2>
          <p className="text-xl line-through">
            ${selectedProduct.originalPrice}
          </p>
          <p className="text-xl text-gray-900">${selectedProduct.price}</p>
          <p className="text-lg">{selectedProduct.description}</p>
          <div className="">
            <h2 className="text-lg mb-1">color :</h2>
            {selectedProduct.colors.map((color) => (
              <button
                onClick={() => setselectedColors(color)}
                style={{ backgroundColor: color }}
                className={`rounded-full mr-2 p-1  border-4 h-8 w-8 ${
                  selectedColors === color
                    ? "border-4 border-black"
                    : " border-gray-300"
                }`}
              ></button>
            ))}
          </div>
          <div className="">
            <h4 className="text-lg">Size :</h4>
            {selectedProduct.sizes.map((size) => (
              <button
                onClick={() => setselectedSizes(size)}
                className={`border border-gray-300  text-lg mr-2 min-w-7 ${
                  selectedSizes === size ? "text-white bg-black" : ""
                }`}
              >
                {size}
              </button>
            ))}
          </div>
          <div className="mb-6">
            <p className="text-gray-700">Quantity:</p>
            <div className="flex items-center space-x-4 mt-2">
              <button
                className="px-2.5 py-1 bg-gray-200  rounded text-lg"
                onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}
              >
                -
              </button>
              <span className="text-lg">{quantity}</span>
              <button
                className="px-2 py-1 bg-gray-200 rounded text-lg"
                onClick={() => setQuantity((prev) => prev + 1)}
              >
                +
              </button>
            </div>
            <button
              onClick={HandleFormSubmit}
              disabled={isButtonDisabled}
              className={`bg-black mt-4 text-white py-2 px-6 rounded w-full ${
                isButtonDisabled
                  ? "cursor-not-allowed opacity-50  "
                  : "hover:bg-gray-900"
              }`}
            >
              {isButtonDisabled ? "Adding....." : "Add To Cart"}
            </button>
          </div>
          <table className="w-full text-left text-sm text-gray-600">
            <tbody>
              <tr>
                <td className="py-1">Brand</td>
                <td className="py-1">{selectedProduct.brand}</td>
              </tr>
              <tr>
                <td className="py-1">Material</td>
                <td className="py-1">{selectedProduct.material}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-20 max-w-5xl mx-auto">
        <h2 className="text-2xl text-center font-medium mb-4"> You May Also Like</h2>
        <ProductGrid products={similarProducts} />
      </div>
      
    </div>
  );
};

export default ProductDetails;
