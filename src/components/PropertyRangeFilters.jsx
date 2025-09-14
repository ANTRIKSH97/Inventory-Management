// import React, { useState, useEffect } from "react";

// /**
//  * Range Slider component for filtering properties by numeric values
//  * @param {Object} props
//  * @param {string} props.label - Label for the slider
//  * @param {number} props.min - Minimum value for the range
//  * @param {number} props.max - Maximum value for the range
//  * @param {number} props.step - Step increment for the slider
//  * @param {number} props.value - Current selected value [min, max]
//  * @param {Function} props.onChange - Function to call when value changes
//  * @param {string} props.unit - Optional unit to display (e.g., "AED", "sqft")
//  * @param {boolean} props.formatAsCurrency - Whether to format values as currency
//  */
// const RangeSlider = ({
//   label,
//   min,
//   max,
//   step,
//   value,
//   onChange,
//   unit = "",
//   formatAsCurrency = false,
// }) => {
//   // State for the current range values
//   const [range, setRange] = useState(value || [min, max]);
//   const [isActive, setIsActive] = useState(false);

//   // Format numbers appropriately
//   const formatValue = (val) => {
//     if (formatAsCurrency) {
//       return new Intl.NumberFormat("en-AE", {
//         style: "decimal",
//         maximumFractionDigits: 0,
//       }).format(val);
//     }
//     return val.toLocaleString();
//   };

//   // Update local state when props change
//   useEffect(() => {
//     if (value && (value[0] !== range[0] || value[1] !== range[1])) {
//       setRange(value);
//     }
//   }, [value]);

//   // Handle changes to either slider
//   const handleChange = (e, index) => {
//     const newValue = parseInt(e.target.value, 10);
//     const newRange = [...range];
//     newRange[index] = newValue;
    
//     // Ensure min <= max
//     if (index === 0 && newRange[0] > newRange[1]) {
//       newRange[0] = newRange[1];
//     }
//     if (index === 1 && newRange[1] < newRange[0]) {
//       newRange[1] = newRange[0];
//     }
    
//     setRange(newRange);
//     setIsActive(true);
//     onChange(newRange);
//   };

//   return (
//     <div className={`w-full ${isActive ? "bg-blue-50 border-blue-500 border rounded-md p-2" : ""}`}>
//       <div className="flex justify-between mb-2">
//         <label className="text-sm font-medium text-gray-700">{label}</label>
//         <div className="text-sm text-gray-600">
//           {formatValue(range[0])} {unit} - {formatValue(range[1])} {unit}
//         </div>
//       </div>
      
//       <div className="relative mt-2 mb-4">
//         <div className="h-1 bg-gray-200 rounded-full absolute w-full top-1/2 transform -translate-y-1/2"></div>
//         <div 
//           className="h-1 bg-blue-500 rounded-full absolute top-1/2 transform -translate-y-1/2"
//           style={{
//             left: `${((range[0] - min) / (max - min)) * 100}%`,
//             right: `${100 - ((range[1] - min) / (max - min)) * 100}%`
//           }}
//         ></div>
        
//         {/* Min slider */}
//         <input
//           type="range"
//           min={min}
//           max={max}
//           step={step}
//           value={range[0]}
//           onChange={(e) => handleChange(e, 0)}
//           className="absolute w-full appearance-none bg-transparent pointer-events-auto cursor-pointer"
//           style={{
//             height: "20px",
//             appearance: "none",
//             WebkitAppearance: "none",
//             background: "transparent",
//             outline: "none",
//           }}
//         />
        
//         {/* Max slider */}
//         <input
//           type="range"
//           min={min}
//           max={max}
//           step={step}
//           value={range[1]}
//           onChange={(e) => handleChange(e, 1)}
//           className="absolute w-full appearance-none bg-transparent pointer-events-auto cursor-pointer"
//           style={{
//             height: "20px",
//             appearance: "none",
//             WebkitAppearance: "none",
//             background: "transparent",
//             outline: "none",
//           }}
//         />
        
//         {/* Custom slider thumb styles with CSS */}
//         <style jsx>{`
//           input[type="range"]::-webkit-slider-thumb {
//             -webkit-appearance: none;
//             appearance: none;
//             width: 16px;
//             height: 16px;
//             border-radius: 50%;
//             background: white;
//             border: 2px solid #3b82f6;
//             cursor: pointer;
//             position: relative;
//             z-index: 2;
//           }
          
//           input[type="range"]::-moz-range-thumb {
//             width: 16px;
//             height: 16px;
//             border-radius: 50%;
//             background: white;
//             border: 2px solid #3b82f6;
//             cursor: pointer;
//             position: relative;
//             z-index: 2;
//           }
//         `}</style>
//       </div>
//     </div>
//   );
// };

// export default RangeSlider;