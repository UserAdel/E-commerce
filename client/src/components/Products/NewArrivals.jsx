import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsByFilters } from "../../redux/slices/productSlice";
import ProductGrid from "./ProductGrid";

const NewArrivals = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(
      fetchProductsByFilters({
        limit: 4,
        sortBy: "createdAt",
      })
    );
  }, [dispatch]);

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-3xl text-center font-bold mb-4">New Arrivals</h2>
      <ProductGrid products={products} loading={loading} error={error} />
    </div>
  );
};

export default NewArrivals;
