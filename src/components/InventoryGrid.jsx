import React, { useState } from "react";
import InventoryCard from "./InventoryCard";

const InventoryGrid = ({ properties }) => {
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "list"

  return (
    <div className="w-full">
      {/* Filter button */}
      <div className="flex justify-between items-center mb-4">
        <button className="px-4 py-2 bg-gray-200 rounded-md border">
          Filter
        </button>
      </div>

      {/* Grid / List toggle */}
      <div className="flex space-x-2 mb-6">
        <button
          onClick={() => setViewMode("grid")}
          className={`px-4 py-2 rounded-md border ${
            viewMode === "grid"
              ? "bg-blue-500 text-white"
              : "bg-white text-gray-700"
          }`}
        >
          Grid View
        </button>
        <button
          onClick={() => setViewMode("list")}
          className={`px-4 py-2 rounded-md border ${
            viewMode === "list"
              ? "bg-blue-500 text-white"
              : "bg-white text-gray-700"
          }`}
        >
          List View
        </button>
      </div>

      {/* Cards */}
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
            : "flex flex-col space-y-3"
        }
      >
        {properties.map((property) => (
          <InventoryCard
            key={property.id}
            property={property}
            viewMode={viewMode}
          />
        ))}
      </div>
    </div>
  );
};

export default InventoryGrid;
