import { useState, useEffect, useRef } from "react";

const RangeFilter = ({
  range = [0, 100],
  interval = 1,
  fromValue,
  setFromValue,
  toValue,
  setToValue,
  label,
  unit,
  fullRange,
  refresh,
}) => {
  const [fullMin, fullMax] = fullRange;

  const [min, max] = range;

  const [isInvalid, setIsInvalid] = useState(false);

  useEffect(() => {
    setFromValue(fullRange[0]);
    setToValue(fullRange[1]);
  }, [setFromValue, setToValue, refresh, fullRange]);

  useEffect(() => {
    // Validate range whenever values change
    setIsInvalid(fromValue > toValue);
  }, [fromValue, toValue]);

  const handleFromChange = (e) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      // Allow free editing without restrictions
      setFromValue(value);
    } else if (e.target.value === "") {
      // Allow clearing the input
      setFromValue("");
    }
  };

  const handleToChange = (e) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      // Allow free editing without restrictions
      setToValue(value);
    } else if (e.target.value === "") {
      // Allow clearing the input
      setToValue("");
    }
  };

  const incrementFrom = () => {
    const newValue = fromValue + interval;
    // Allow any value within min-max range, even if it makes the range invalid
    if (newValue <= max) {
      setFromValue(newValue);
    }
  };

  const decrementFrom = () => {
    const newValue = fromValue - interval;
    if (newValue >= min) {
      setFromValue(newValue);
    }
  };

  const incrementTo = () => {
    const newValue = toValue + interval;
    if (newValue <= max) {
      setToValue(newValue);
    }
  };

  const decrementTo = () => {
    const newValue = toValue - interval;
    // Allow any value within min-max range, even if it makes the range invalid
    if (newValue >= min) {
      setToValue(newValue);
    }
  };

  return (
  <div className="w-full max-w-md mx-auto bg-white/60 backdrop-blur-md shadow-lg rounded-2xl p-5 border border-gray-200">
    <div className="mb-3 flex justify-between items-center">
      <span className="text-sm font-semibold text-gray-800 tracking-wide">
        {label} Filter
      </span>
      {isInvalid && (
        <span className="text-sm font-semibold text-red-500 animate-pulse">
          Invalid Range
        </span>
      )}
    </div>

    <div className="flex flex-col md:flex-row gap-5">
      {/* From input group */}
      <div className="flex-1">
        <label className="block text-xs font-medium text-gray-600 mb-1">
          From
        </label>
        <div className="flex rounded-lg overflow-hidden shadow-sm">
          <button
            onClick={decrementFrom}
            className="px-3 py-2 bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 transition-all duration-200"
            aria-label="Decrease from value"
          >
            -
          </button>
          <input
            type="number"
            value={fromValue}
            onChange={handleFromChange}
            className={`w-full px-3 py-2 text-center border-t border-b outline-none transition-all duration-200 ${
              isInvalid ? "border-red-400 focus:ring-red-400" : "border-gray-200 focus:ring-blue-400"
            }`}
          />
          <button
            onClick={incrementFrom}
            className="px-3 py-2 bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 transition-all duration-200"
            aria-label="Increase from value"
          >
            +
          </button>
        </div>
      </div>

      {/* To input group */}
      <div className="flex-1">
        <label className="block text-xs font-medium text-gray-600 mb-1">
          To
        </label>
        <div className="flex rounded-lg overflow-hidden shadow-sm">
          <button
            onClick={decrementTo}
            className="px-3 py-2 bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 transition-all duration-200"
            aria-label="Decrease to value"
          >
            -
          </button>
          <input
            type="number"
            value={toValue}
            onChange={handleToChange}
            className={`w-full px-3 py-2 text-center border-t border-b outline-none transition-all duration-200 ${
              isInvalid ? "border-red-400 focus:ring-red-400" : "border-gray-200 focus:ring-blue-400"
            }`}
          />
          <button
            onClick={incrementTo}
            className="px-3 py-2 bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 transition-all duration-200"
            aria-label="Increase to value"
          >
            +
          </button>
        </div>
      </div>
    </div>

    <div className="mt-3 text-sm font-medium text-gray-600 text-center">
      Full Range:{" "}
      <span className="text-blue-600 font-semibold">
        {fullMin} {unit}
      </span>{" "}
      -{" "}
      <span className="text-blue-600 font-semibold">
        {fullMax} {unit}
      </span>
    </div>
  </div>
);

};

export default RangeFilter;
