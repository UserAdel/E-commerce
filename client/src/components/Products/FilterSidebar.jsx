import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const FilterSidebar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filter, setFilter] = useState({
    category: "",
    gender: "",
    color: "",
    size: [],
    material: [],
    brand: [],
    minPrice: "",
    maxPrice: "100",
  });
  const [priceRange, setPriceRange] = useState([0, 100]);

  const categories = ["Top Wear", "Bottom Wear"];
  const colors = [
    "Red",
    "Blue",
    "Green",
    "Yellow",
    "Gray",
    "white",
    "Pink",
    "Beige",
    "Navy",
    "Black",
  ];
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const materials = [
    "Cotton",
    "Wool",
    "Demin",
    "Silk",
    "Linen",
    "Viscose",
    "Fleece",
  ];
  const brands = [
    "Urban Threads",
    "Modern Fit",
    "Streat Style",
    "Beach Breeze",
    "Fashionista",
    "ChicStyle",
  ];
  const genders = ["Men", "Women"];

  useEffect(() => {
    const params = Object.fromEntries([...searchParams]);
    setFilter({
      category: params.category || "",
      gender: params.gender || "",
      color: params.color || "",
      size: params.size ? params.size.split(",") : [],
      material: params.material ? params.material.split(",") : [],
      brand: params.brand ? params.brand.split(",") : [],
      minPrice: params.minPrice || "",
      maxPrice: params.maxPrice || "100",
    });
    setPriceRange([params.minPrice || 0, params.maxPrice || 100]);
  }, [searchParams]);

  const updateSearchParams = (newFilters) => {
    const params = new URLSearchParams(searchParams);
    
    // Clear existing params
    params.forEach((_, key) => params.delete(key));
    
    // Add new params
    Object.entries(newFilters).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length > 0) {
        params.set(key, value.join(","));
      } else if (value && value !== "") {
        params.set(key, value);
      }
    });
    
    setSearchParams(params, { replace: true });
  };

  const handlePriceRangeChange = (e) => {
    const newPrice = e.target.value;
    const newFilter = { ...filter, minPrice: 0, maxPrice: newPrice };
    setFilter(newFilter);
    updateSearchParams(newFilter);
  };

  const handleFilterChange = (e) => {
    const { name, value, checked, type } = e.target;
    let newFilter = { ...filter };
    
    if (type === "checkbox") {
      if (checked) {
        newFilter[name] = [...newFilter[name], value];
      } else {
        newFilter[name] = newFilter[name].filter((item) => item !== value);
      }
    } else if (type === "radio") {
      newFilter[name] = value;
    } else {
      newFilter[name] = value;
    }

    setFilter(newFilter);
    updateSearchParams(newFilter);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Filters</h2>

      <div className="mb-4">
        <label className="mb-1 text-xl">Categories</label>
        <div className="flex flex-col mt-2">
          {categories.map((category) => (
            <div key={category} className="flex mb-2">
              <input
                type="radio"
                name="category"
                value={category}
                checked={filter.category === category}
                className="size-4 mt-2"
                onChange={handleFilterChange}
              />
              <label className="ml-2 text-lg">{category}</label>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="mb-1 text-xl">Genders</label>
        <div className="flex flex-col mt-2">
          {genders.map((gender) => (
            <div key={gender} className="flex mb-2">
              <input
                type="radio"
                name="gender"
                value={gender}
                className="size-4 mt-2"
                checked={filter.gender === gender}
                onChange={handleFilterChange}
              />
              <label className="ml-2 text-lg">{gender}</label>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="text-xl">Colors</label>
        <div className="flex flex-wrap mt-2">
          {colors.map((color) => (
            <div key={color} className="mr-5 mt-2">
              <input
                type="radio"
                name="color"
                value={color}
                id={`color-${color}`}
                checked={filter.color === color}
                onChange={handleFilterChange}
                className="hidden"
              />
              <label
                htmlFor={`color-${color}`}
                style={{ backgroundColor: color.toLowerCase() }}
                className={`w-8 h-8 hover:scale-105 cursor-pointer rounded-full border-2 flex items-center justify-center ${
                  filter.color === color ? "ring-2 ring-blue-500" : ""
                }`}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="text-xl">Sizes</label>
        <div className="flex flex-col mt-2">
          {sizes.map((size) => (
            <div key={size} className="flex items-center">
              <input
                type="checkbox"
                name="size"
                value={size}
                checked={filter.size.includes(size)}
                className="size-4 focus:ring-blue-400 border-gray-300"
                onChange={handleFilterChange}
              />
              <label className="ml-2 mt-1 text-lg">{size}</label>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="text-xl">Materials</label>
        <div className="flex flex-col mt-2">
          {materials.map((material) => (
            <div key={material} className="flex items-center">
              <input
                type="checkbox"
                name="material"
                value={material}
                className="size-4"
                checked={filter.material.includes(material)}
                onChange={handleFilterChange}
              />
              <label className="ml-2 mt-1 text-lg focus:ring-blue-400 border-gray-300">
                {material}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="text-xl">Brands</label>
        <div className="flex flex-col mt-2">
          {brands.map((brand) => (
            <div key={brand} className="flex items-center">
              <input
                type="checkbox"
                name="brand"
                value={brand}
                className="size-4"
                checked={filter.brand.includes(brand)}
                onChange={handleFilterChange}
              />
              <label className="ml-2 mt-1 text-lg focus:ring-blue-400 border-gray-300">
                {brand}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <div className="block text-gray-600 font-medium mb-2">
          <label>
            <input
              type="range"
              name="priceRange"
              min={0}
              value={priceRange[1]}
              onChange={handlePriceRangeChange}
              max={100}
              className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
            />
          </label>

          <div className="flex justify-between text-gray-600 mt-2">
            <span>$0</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
