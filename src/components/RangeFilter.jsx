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
    <div className="w-full max-w-md mx-auto">
      <div className="mb-1 flex justify-between">
        <span className="text-sm font-medium text-gray-700">
          {label} Filter
        </span>
        {isInvalid && (
          <span className="text-sm font-medium text-red-500">
            Invalid Range
          </span>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        {/* From input group */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            From
          </label>
          <div className="flex">
            <button
              onClick={decrementFrom}
              className="px-3 py-2 bg-gray-200 rounded-l-md hover:bg-gray-300 focus:outline-none"
              aria-label="Decrease from value"
            >
              -
            </button>
            <input
              type="number"
              value={fromValue}
              onChange={handleFromChange}
              /* Removed min/max restrictions to allow free editing */
              className={`w-full px-3 py-2 border ${
                isInvalid ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            <button
              onClick={incrementFrom}
              className="px-3 py-2 bg-gray-200 rounded-r-md hover:bg-gray-300 focus:outline-none"
              aria-label="Increase from value"
            >
              +
            </button>
          </div>
        </div>

        {/* To input group */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            To
          </label>
          <div className="flex">
            <button
              onClick={decrementTo}
              className="px-3 py-2 bg-gray-200 rounded-l-md hover:bg-gray-300 focus:outline-none"
              aria-label="Decrease to value"
            >
              -
            </button>
            <input
              type="number"
              value={toValue}
              onChange={handleToChange}
              /* Removed min/max restrictions to allow free editing */
              className={`w-full px-3 py-2 border ${
                isInvalid ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            <button
              onClick={incrementTo}
              className="px-3 py-2 bg-gray-200 rounded-r-md hover:bg-gray-300 focus:outline-none"
              aria-label="Increase to value"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div className="mt-2 text-sm text-gray-500">
        Full Range: {fullMin} {unit} - {fullMax} {unit}
      </div>
    </div>
  );
};

export default RangeFilter;
