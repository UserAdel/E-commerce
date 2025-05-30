import React, { useEffect, useState } from "react";
import Hero from "../Layout/Hero";
import GenderCollectionSection from "../Products/GenderCollectionSection";
import NewArrivals from "../Products/NewArrivals";
import ProductDetails from "../Products/ProductDetails.jsx";
import ProductGrid from "../Products/ProductGrid.jsx";
import FeaturedCollection from "../Products/FeaturedCollection.jsx";
import FeaturesSection from "../Products/FeaturesSection.jsx";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { fetchProductsByFilters } from "../../redux/slices/productSlice";

const Home = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const [bestSellerProduct, setBestSellerProduct] = useState(null);
  const [bestSellerLoading, setBestSellerLoading] = useState(true);
  const [bestSellerError, setBestSellerError] = useState(null);

  useEffect(() => {
    // Fetch all products without filters first
    dispatch(
      fetchProductsByFilters({
        limit: 8
      })
    );
    
    const fetchBestSeller = async () => {
      try {
        setBestSellerLoading(true);
        setBestSellerError(null);
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/best-seller`
        );
        if (response.data && response.data.length > 0) {
          setBestSellerProduct(response.data[0]);
        }
      } catch (error) {
        setBestSellerError(error.message);
      } finally {
        setBestSellerLoading(false);
      }
    };
    fetchBestSeller();
  }, [dispatch]);

  return (
    <div className="">
      <Hero />
      <GenderCollectionSection />
      <NewArrivals />
      <h2 className="text-3xl text-center font-bold mb-4">Best Seller</h2>
      {bestSellerLoading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : bestSellerError ? (
        <p className="text-center text-red-500">Error loading best seller: {bestSellerError}</p>
      ) : bestSellerProduct ? (
        <ProductDetails productId={bestSellerProduct._id} />
      ) : (
        <p className="text-center">No best seller product available</p>
      )}
      <div className="container mx-auto">
        <h2 className="text-3xl text-center font-bold mb-4">
          Top Wears For Women
        </h2>
        <ProductGrid products={products} error={error} loading={loading} />
      </div>
      <FeaturedCollection />
      <FeaturesSection />
    </div>
  );
};

export default Home;
