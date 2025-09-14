// import { useState, useEffect } from "react";
import axios from "axios";

const fetchAllData = async () => {
  let page = 1;
  let aggregateData = [];
  let total = Infinity;

  while (aggregateData.length < total) {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_IMZA_INVENTORY_API}${page}`
      );
      const { data, total: newTotal } = response.data;

      if (!Array.isArray(data) || typeof newTotal !== "number") {
        console.error("Unexpected response format", response.data);
        break;
      }

      aggregateData = [...aggregateData, ...data];
      total = newTotal;

      if (aggregateData.length >= total) break;

      page++;
    } catch (error) {
      console.error("Error fetching data:", error);
      break;
    }
  }
  return aggregateData;
};

export default fetchAllData;
