import React, { useState, useEffect } from "react";
import InventoryCard from "./components/InventoryCard";
import Searchbar from "./components/SearchBar";
import Pagination from "./Pagination";
import fetchAllData from "./utils/fetchAllData";
import FilterForm from "./components/FilterForm";
import calculateRanges from "./utils/calculateRange";

const Listing = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [propertiesData, setPropertiesData] = useState([]);
  const [areaRange, setAreaRange] = useState([0, 0]);
  const [priceRange, setPriceRange] = useState([0, 0]);
  const [refresh, setRefresh] = useState(0);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // 👇 New state for grid/list toggle
  const [isGridView, setIsGridView] = useState(true);

  const totalItems = filteredData.length;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFilteredData = filteredData.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const allData = await fetchAllData();
        setPropertiesData(allData);
        setError(null);
      } catch (err) {
        setError("Failed to load properties.");
        setPropertiesData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [refresh]);

  useEffect(() => {
    const { priceRange: fullPrice, areaRange: fullArea } = calculateRanges(
      "full",
      propertiesData
    );
    setAreaRange(fullArea);
    setPriceRange(fullPrice);
  }, [propertiesData]);

  useEffect(() => {
    setFilteredData(
      propertiesData.filter(
        (property) =>
          property.locationPf
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          property.locationBayut
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, propertiesData]);

  return (
    <div className="mx-auto">
      <FilterForm
        filteredData={filteredData}
        setFilteredData={setFilteredData}
        refresh={refresh}
        setRefresh={setRefresh}
        fullAreaRange={areaRange}
        fullPriceRange={priceRange}
      />

{/* Toggle Button - Naya aur Behtar Layout */}
<div className="flex justify-end max-w-5xl mx-auto px-4 mb-4">
  <button
    onClick={() => setIsGridView(!isGridView)}
    className="relative flex items-center justify-around w-24 h-9 rounded-full transition-colors duration-500 focus:outline-none
               bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg"
  >
   {/* Sliding Knob */}
<span
  className={`absolute top-1 left-1 w-1/2 h-7 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out
  ${isGridView ? "translate-x-full" : "translate-x-0"}`}
  style={{ width: "calc(50% - 0.34rem)" }} // knob ko parent ke hisaab se exact half banane ke liye
/>

    {/* Labels (ab button ke flex-items hain) */}
    <span className={`z-10 text-xs font-bold transition-colors duration-300 ${!isGridView ? "text-green-700" : "text-white"}`}>
      List
    </span>
    <span className={`z-10 text-xs font-bold transition-colors duration-300 ${isGridView ? "text-green-700" : "text-white"}`}>
      Grid
    </span>
  </button>
</div>


      {/* Error Message */}
      {error && (
        <p className="text-center text-red-500 text-lg font-semibold py-4">
          {error}
        </p>
      )}

      {/* Loading Message */}
      {isLoading ? (
        <p className="text-center text-2xl md:text-4xl text-gray-500 font-semibold py-8">
          Loading...
        </p>
      ) : (
        <>
          {filteredData.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No properties found with selected filters or search.
            </p>
          ) : (
            <div className="max-w-5xl mx-auto px-1 md:px-4">
              <div className="bg-gray-50/50 rounded-xl p-1 backdrop-blur-sm">
               {isGridView ? (
  // 👉 Grid View
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 justify-items-center">
    {currentFilteredData.map((property, index) => (
      <InventoryCard
        key={index}
        property={property}
        className="w-[20rem] h-[22rem]" // fixed size for grid
      />
    ))}
  </div>
) : (
  // 👉 List View
  <div className="space-y-4">
    {currentFilteredData.map((property, index) => (
      <div key={index} className="w-full max-w-3xl mx-auto">
        <InventoryCard
          property={property}
          className="w-full h-auto p-3 rounded-lg border shadow-sm hover:shadow-md transition"
        />
      </div>
    ))}
  </div>
)}

              </div>
            </div>
          )}
        </>
      )}

      {/* Show pagination only if not loading and data exists */}
      {!isLoading && filteredData.length > 0 && (
        <Pagination
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalItems={totalItems}
        />
      )}
    </div>
  );
};

export default Listing;