import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

const FilterSidebar = () => {
  const [searchParams, setsearchParams] = useSearchParams({});
  const navigate = useNavigate();
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
  const genders = ["Men", "Woman"];

  useEffect(() => {
    const prams = Object.fromEntries([...searchParams]);
    setFilter({
      category: prams.category || "",
      gender: prams.gender || "",
      color: prams.color || "",
      size: prams.size ? prams.size.split(",") : [],
      material: prams.material ? prams.material.split(",") : [],
      brand: prams.brand ? prams.brand.split(",") : [],
      minPrice: prams.minPrice || "",
      maxPrice: prams.maxPrice || "100",
    });
    setPriceRange([prams.minPrice || 0, prams.maxPrice || 100]);
  }, [searchParams]);

  const updateSearchParams = (newfilters) => {
    const params = new URLSearchParams();
    Object.keys(newfilters).forEach((key) => {
      if (Array.isArray(newfilters[key]) && newfilters[key].length) {
        params.append(key, newfilters[key].join(","));
      } else {
        params.append(key, newfilters[key]);
      }
    });
    setsearchParams(params);
    navigate(`?${params.toString()}`);
  };
const handlePriceRangeChange = (e) => {
  const newPrice = e.target.value;
  const newfilter = { ...filter, minPrice: 0, maxPrice: newPrice }; 
  setFilter(newfilter);
  updateSearchParams(newfilter);
};

  const handleFilterChange = (e) => {
    const { name, value, checked, type } = e.target;
    let newfilter = { ...filter };
    if (type === "checkbox") {
      if (checked) {
        newfilter[name] = [...newfilter[name], value];
      } else {
        newfilter[name] = newfilter[name].filter((item) => item !== value);
      }
    } else {
      newfilter[name] = value;
    }

    setFilter(newfilter);
    updateSearchParams(newfilter);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4"> Filters</h2>

      <div className="mb-4">
        <label className="mb-1 text-xl">categories </label>
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

      <div className="mb-4 ">
        <label className="mb-1 text-xl">Genders </label>
        <div className="flex flex-col mt-2">
          {genders.map((genders) => (
            <div key={genders} className="flex mb-2">
              <input
                type="radio"
                name="gender"
                value={genders}
                className="size-4 mt-2"
                checked={filter.gender === genders}
                onChange={handleFilterChange}
              />
              <label className="ml-2 text-lg">{genders}</label>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className=" text-xl">colors </label>
        <div className="flex flex-wrap ">
          {colors.map((color) => (
            <button
              key={color}
              name="color"
              value={color}
              onClick={handleFilterChange}
              style={{ backgroundColor: color.toLowerCase() }}
              className={`mr-5 mt-2 w-8 h-8 hover:scale-105 cursor-pointer rounded-full border-2 flex items-center justify-center ${
                filter.color === color ? "ring-2 ring-blue-500" : ""
              }`}
            />
          ))}
        </div>
      </div>

      <div className="mb-4 ">
        <label className=" text-xl ">sizes </label>
        <div className="flex flex-col mt-2">
          {sizes.map((sizes) => (
            <div key={sizes} className="flex items-center ">
              <input
                type="checkbox"
                name="size"
                value={sizes}
                checked={filter.size.includes(sizes)}
                className="size-4 focus:ring-blue-400 border-gray-300"
                onChange={handleFilterChange}
              />
              <label className="ml-2 mt-1 text-lg ">{sizes}</label>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4 ">
        <label className=" text-xl ">materials </label>
        <div className="flex flex-col mt-2">
          {materials.map((material) => (
            <div key={material} className="flex items-center ">
              <input
                type="checkbox"
                name="material"
                value={material}
                className="size-4 "
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
