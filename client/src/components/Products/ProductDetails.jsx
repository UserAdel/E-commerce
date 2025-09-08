import React from "react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import ProductGrid from "./ProductGrid";
import FeaturedCollection from "./FeaturedCollection";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductDetails,
  fetchSimilarProducts,
} from "../../redux/slices/productSlice";
import { addToCart } from "../../redux/slices/cartSlice";

const ProductDetails = ({ productId }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedProduct, loading, error, similarProducts } = useSelector(
    (state) => state.products
  );

  const { user, guestId } = useSelector((state) => state.auth);

  const [mainImage, setMainImage] = useState(null);
  const [selectedSizes, setselectedSizes] = useState(null);
  const [selectedColors, setselectedColors] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const productFetchId = productId || id;

  useEffect(() => {
    if (productFetchId) {
      dispatch(fetchProductDetails(productFetchId));
      dispatch(fetchSimilarProducts({ id: productFetchId }));
    }
  }, [dispatch, productFetchId]);

  useEffect(() => {
    if (selectedProduct?.images?.[0]?.url) {
      setMainImage(selectedProduct.images[0].url);
    }
  }, [selectedProduct]);

  const HandleFormSubmit = () => {
    if (!selectedSizes || !selectedColors) {
      toast.error("Please select a size and color", { duration: 1000 });
      return;
    }
    setIsButtonDisabled(true);

    dispatch(
      addToCart({
        productId: productFetchId,
        quantity,
        size: selectedSizes,
        color: selectedColors,
        guestId,
        userId: user?.id,
      })
    )
      .then(() => {
        toast.success("product added to the cart", { duration: 1000 });
      })
      .finally(() => {
        setIsButtonDisabled(false);
      });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="md:ml-16 animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  if (error) {
    return <p>Error:{error}</p>;
  }

  return (
    <div>
      {selectedProduct && (
        <div className="container mx-auto max-w-4xl pt-8 flex flex-col md:flex-row w-full">
          <div className=" hidden md:flex flex-col mx-4">
            {selectedProduct.images.map((image, index) => (
              <img
                key={index}
                src={image.url}
                alt={image.altText || `Product image ${index + 1}`}
                draggable="false"
                onClick={() => setMainImage(image.url)}
                className={`w-20 h-20 mb-4 rounded-lg ${
                  mainImage === image.url ? "border-2 border-black" : ""
                }`}
              />
            ))}
          </div>
          <div className="max-w-4xl">
            {mainImage && (
              <img
                src={mainImage}
                alt="Main product image"
                draggable="false"
                className="object-cover rounded-lg"
              />
            )}
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
            {selectedProduct.originalPrice ? (
              <p className="text-xl line-through">
                ${selectedProduct.originalPrice}
              </p>
            ) : null}

            <p className="text-xl text-gray-900">${selectedProduct.price}</p>
            <p className="text-lg">{selectedProduct.description}</p>
            <div className="">
              <h2 className="text-lg mb-1">color :</h2>
              {selectedProduct.colors.map((color) => (
                <button
                  key={color}
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
                  key={size}
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
      )}

      <div className="mt-20 max-w-5xl mx-auto">
        <h2 className="text-2xl text-center font-medium mb-4">
          {" "}
          You May Also Like
        </h2>
        <ProductGrid
          products={similarProducts}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  );
};

export default ProductDetails;
