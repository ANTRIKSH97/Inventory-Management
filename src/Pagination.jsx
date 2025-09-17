import React, { useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({
    itemsPerPage,
    setItemsPerPage,
    currentPage,
    setCurrentPage,
    totalItems,
}) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const pageLimit = 5; // Ek baar mein kitne page numbers dikhane hain (ellipsis ke beech)

    // Jab bhi 'currentPage' badlega, yeh page ko upar scroll kar dega.
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, [currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Yeh function dikhane waale page numbers ka array banata hai
    const getPaginationGroup = () => {
        let start = Math.floor((currentPage - 1) / pageLimit) * pageLimit;
        const end = Math.min(start + pageLimit, totalPages);
        
        const pages = [];
        for (let i = start + 1; i <= end; i++) {
            pages.push(i);
        }

        // Ellipsis logic
        const paginationGroup = [];
        if (pages[0] > 1) {
            paginationGroup.push(1);
            if (pages[0] > 2) {
                paginationGroup.push('...');
            }
        }
        paginationGroup.push(...pages);
        if (pages[pages.length - 1] < totalPages) {
            if (pages[pages.length - 1] < totalPages - 1) {
                paginationGroup.push('...');
            }
            paginationGroup.push(totalPages);
        }

        return paginationGroup;
    };


    return (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-3 rounded-xl shadow-md w-full max-w-full sm:max-w-3xl mx-auto">
            {/* Items per page selector */}
            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700 font-medium whitespace-nowrap">Items per page:</span>
                <select 
                    value={itemsPerPage}
                    onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                    }}
                    className="border border-gray-300 rounded px-2 py-1 text-sm"
                >
                    {[10, 20, 30, 50, 100].map(value => (
                        <option key={value} value={value}>{value}</option>   
                    ))}
                </select>
            </div>

            {/* --- Naya Page Navigation --- */}
            <div className="flex items-center gap-2">
                {/* Previous Button */}
                <button 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50"
                >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>

                {/* Page Numbers */}
                {getPaginationGroup().map((item, index) => (
                    typeof item === 'number' ? (
                        <button 
                            key={index} 
                            onClick={() => handlePageChange(item)}
                            className={`px-3.5 py-1.5 rounded-md text-sm font-semibold transition-colors ${
                                currentPage === item 
                                ? 'bg-blue-600 text-white shadow-sm' 
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            {item}
                        </button>
                    ) : (
                        <span key={index} className="px-2 py-1 text-sm text-gray-500">...</span>
                    )
                ))}

                {/* Next Button */}
                <button 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50"
                >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
            </div>
            
            <span className="text-sm text-gray-500 whitespace-nowrap">
                Page {currentPage} of {totalPages}
            </span>
        </div>
    );
};

export default Pagination;

