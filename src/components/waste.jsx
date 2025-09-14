return (
  <div className="w-full px-4 py-2 space-y-4">
    {/* Main Search Bar and Buttons */}
    <div className="relative w-full max-w-5xl mx-auto my-6 z-20">
      <div className="flex items-center space-x-2">
        {/* Search Input */}
        <div className="relative flex-1">
          <AutocompleteSearch
            locations={locationsArray}
            savedProperty={savedFilteredData.current}
            setProperty={setFilteredData}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>
        
        {/* Search and Filter Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleFilterClick}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow-md hover:bg-blue-700 transition-colors"
          >
            <Search size={20} className="inline-block mr-2" />
            Search
          </button>
          <button
            onClick={toggleFilters}
            className="px-6 py-3 bg-white text-gray-700 rounded-lg font-semibold shadow-md border border-gray-300 hover:bg-gray-100 transition-colors"
          >
            <Filter size={20} className="inline-block mr-2" />
            Filter
          </button>
        </div>
      </div>
    </div>
    
    {/* Filter Dropdown - Conditionally rendered */}
    {showFilters && (
      <div className="absolute top-44 left-0 right-0 p-6 bg-white border border-gray-200 rounded-xl shadow-lg z-10 mx-auto max-w-5xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Advanced Filters</h3>
          <button
            onClick={toggleFilters}
            className="text-gray-500 hover:text-gray-800 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Range Filters from original code */}
          <div className="md:flex p-4 sm:p-6 w-full max-w-full mx-auto bg-white rounded-xl shadow-md">
            <RangeFilter
              range={areaRange}
              interval={5}
              fromValue={fromArea}
              setFromValue={setFromArea}
              toValue={toArea}
              setToValue={setToArea}
              label="Area"
              unit="sqft."
              fullRange={fullAreaRange}
              refresh={refresh}
            />
            <RangeFilter
              range={priceRange}
              interval={100000}
              fromValue={fromPrice}
              setFromValue={setFromPrice}
              toValue={toPrice}
              setToValue={setToPrice}
              label="Price"
              unit="AED"
              fullRange={fullPriceRange}
              refresh={refresh}
            />
          </div>

          {/* Other Filters from original code */}
          <div className="bg-white bg-opacity-90 rounded-lg shadow p-4 w-full max-w-[85%] mx-auto flex flex-col md:flex-row md:items-center md:gap-3">
            <div className="grid grid-cols-6 gap-3 md:flex md:flex-row md:flex-wrap md:gap-3 md:flex-grow">
              <div className="col-span-6 sm:col-span-2 w-[25%]">
                <SearchableSelect
                  name="ownerName"
                  value={filters.ownerName}
                  onChange={handleInputChange}
                  placeholder="Listing Owner"
                  options={ownerArray.filter(Boolean)}
                />
              </div>
              {selectFilters.map((filter) => (
                <div key={filter.name} className="col-span-3 sm:col-span-2">
                  <select
                    name={filter.name}
                    value={filters[filter.name]}
                    onChange={handleInputChange}
                    className={
                      getInputStyle(filter.name) + " bg-white appearance-none"
                    }
                  >
                    <option value="">{filter.label}</option>
                    {filter.options.map((option) =>
                      option === "" ? null : (
                        <option key={option} value={option}>
                          {filter.name === "bedrooms" && option == 0
                            ? "Studio"
                            : option}
                        </option>
                      )
                    )}
                  </select>
                </div>
              ))}
            </div>
            <div className="mt-4 md:mt-0 flex flex-row justify-center md:justify-start gap-3 flex-shrink-0">
              <button
                type="button"
                onClick={handleRefresh}
                className="bg-[#2abd69] h-11 w-11 hover:bg-green-600 text-white font-semibold rounded-md flex items-center justify-center"
              >
                <RefreshCcw
                  className={`h-5 w-5 ${isSpinning ? "animate-spin" : ""}`}
                  style={{ animationDuration: isSpinning ? "1s" : "0s" }}
                />
              </button>
              <button
                type="button"
                onClick={handleFilterClick}
                className="bg-[#1c6638] h-11 hover:bg-[#0C372A] text-white font-semibold py-2 px-5 text-sm rounded-md"
              >
                Search
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="bg-gray-300 h-11 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-5 text-sm rounded-md"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
);
