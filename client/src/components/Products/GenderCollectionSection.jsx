import React from "react";
import mensCollectionImage from "../../assets/mens-collection.webp";
import womensCollectionImage from "../../assets/womens-collection.webp";
import { Link } from "react-router-dom";

const GenderCollectionSection = () => {
  return (
    <section className="py-8 md:px-4 px-0 lg:px-0 ">
      <div className=" container mx-auto flex md:flex-row gap-8 flex-col  ">

      <div className="relative flex-1">
        <img
          src={mensCollectionImage}
          alt="mensCollectionImage"
          className="h-[700px] w-full object-cover"
          />
        <div className="bottom-8 left-8 absolute bg-white p-4">
          <h2 className="font-bold text-2xl">Mens Collections</h2>
          <Link to="/collections/all?gender=Men"
          className="underline"
          >shop now</Link>
        </div>
      </div>
      <div className="relative flex-1">
        <img
          src={womensCollectionImage}
          alt="mensCollectionImage"
          className="h-[700px] w-full object-cover"
          />
        <div className="bottom-8 left-8 absolute bg-white p-4 ">
          <h2 className="font-bold text-2xl">Womens Collections</h2>
          <Link to="/collections/all?gender=Women"
          className="underline"
          >shop now</Link>
        </div>
      </div>
          </div>
    </section>
  );
};

export default GenderCollectionSection;
