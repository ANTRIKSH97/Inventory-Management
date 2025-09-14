const calculateRanges = (source = "", data) => {
  try {
    // Initialize with null values to handle empty data case
    let minPrice = null;
    let maxPrice = null;
    let minArea = null;
    let maxArea = null;

    // Process only if data exists and has items
    if (data && data.length > 0) {
      // Process each property
      data.forEach((property) => {
        // Handle price - Convert from string with commas to number
        if (property.price) {
          const priceString = property.price.replace(/[^\d.-]/g, ""); // Remove non-numeric chars except decimal point
          const price = parseFloat(priceString);

          if (!isNaN(price)) {
            // Set initial values or compare with current min/max
            if (minPrice === null || price < minPrice) minPrice = price;
            if (maxPrice === null || price > maxPrice) maxPrice = price;
          }
        }

        // Handle area/size - Should already be numeric but handle possible string case
        if (property.size) {
          const area =
            typeof property.size === "string"
              ? parseFloat(property.size)
              : property.size;

          if (!isNaN(area)) {
            // Set initial values or compare with current min/max
            if (minArea === null || area < minArea) minArea = area;
            if (maxArea === null || area > maxArea) maxArea = area;
          }
        }
      });
    }

    // Set defaults if no valid values were found
    minPrice = minPrice === null ? 0 : minPrice;
    maxPrice = maxPrice === null ? 0 : maxPrice;
    minArea = minArea === null ? 0 : minArea;
    maxArea = maxArea === null ? 0 : maxArea;

    // Round price values for better UX
    minPrice = Math.floor(minPrice);
    maxPrice = Math.ceil(maxPrice);

    // Round area values to nearest whole number
    minArea = Math.floor(minArea);
    maxArea = Math.ceil(maxArea);

    return {
      priceRange: [minPrice, maxPrice],
      areaRange: [minArea, maxArea],
    };
  } catch (error) {
    console.error("Error in calculateRanges:", error);
    return {
      priceRange: [0, 0],
      areaRange: [0, 0],
    };
  }
};

export default calculateRanges;
