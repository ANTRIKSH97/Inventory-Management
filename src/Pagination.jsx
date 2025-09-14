import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ itemsPerPage, setItemsPerPage, currentPage, setCurrentPage, totalItems }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    return (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-2 sm:p-3 rounded-lg sm:rounded-xl md:rounded-2xl shadow-md w-full max-w-full sm:max-w-3xl mx-auto">
            {/* Items per page selector */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-sm sm:text-base text-gray-700 font-medium whitespace-nowrap">Items per page:</span>
                <select 
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 flex-grow sm:flex-grow-0"
                >
                    {[5, 10, 15, 20, 25, 30].map(value => (
                        <option key={value} value={value}>{value}</option>
                    ))}
                </select>
            </div>

            {/* Page navigation */}
            <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-2 sm:gap-4">
                <span className="text-xs sm:text-sm md:text-base text-gray-700 whitespace-nowrap">
                    {currentPage * itemsPerPage - itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}
                </span>
                <div className="flex gap-1 sm:gap-2">
                    <button 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-1 sm:p-2 rounded-md hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Previous page"
                    >
                        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                    </button>
                    <button 
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="p-1 sm:p-2 rounded-md hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Next page"
                    >
                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Pagination;