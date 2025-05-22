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


const Home = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const [bestSellerProduct, setbestSellerProduct] = useState(null);

  useEffect(() => {
    dispatch(
      fetchProductByfilters({
        gender: "Woman",
        category: "Bottom wear",
        limit: 8,
      })
    );
    const fetchBestSeller = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/best-seller`
        );
        setbestSellerProduct(response.data);
      } catch (error) {
        console.error(error);
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
      {bestSellerProduct ? (
        <ProductDetails productId={bestSellerProduct._id} />
      ) : (
        <p className="text-center"> loading best seller product... </p>
      )}
      \{" "}
      <div className="container mx-auto">
        <h2 className="text-3xl text-center font-bold  mb-4">
          {" "}
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
