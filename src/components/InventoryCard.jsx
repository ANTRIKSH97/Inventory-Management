import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BedDouble,
  MapPin,
  Phone,
  MessageCircle,
  Dot,
  ChevronLeft,
  ChevronRight,
  Bath,
  BedSingle,
  ExternalLink,
} from "lucide-react";
import PropertyBrochureGenerator from "./PropertyBrochureGenerator";
const PropertyCard = ({ property }) => {
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const navigate = useNavigate();

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setMainImageIndex((prevIndex) =>
      prevIndex === 0 ? property.images.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    setMainImageIndex((prevIndex) =>
      prevIndex === property.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Function to format the time since listing was added
  const formatTimeSinceAdded = (createdAt) => {
    if (!createdAt) return "N/A";
    const listingDate = new Date(createdAt);
    const now = new Date();
    const diffInMs = now - listingDate;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return listingDate.toLocaleDateString();
  };

  return (
    <div
      className="md:flex bg-white rounded-lg shadow-md overflow-hidden my-4 w-[100%] cursor-pointer border-zinc-300 border-2 "
      onClick={() => navigate(`/${property.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          navigate(`/${property.id}`);
        }
      }}
    >
      {/* Image Section - Full width and more square on mobile, 42% width on desktop */}
      <div className="w-full h-54 md:h-80 md:h-auto md:w-[42%] relative">
        {property.images[mainImageIndex]?.url ? (
          <img
            src={property.images[mainImageIndex].url}
            alt={property.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-54 md:h-80 bg-blue-100 flex items-center justify-center">
            <span className="text-blue-800 text-xl">NO IMAGE AVAILABLE</span>
          </div>
        )}
        {property.unitType && (
          <div className="absolute top-2 right-2 bg-white text-black text-xs font-semibold px-2 py-1 rounded shadow">
            {property.offeringType}
          </div>
        )}

        {property.images.length > 1 && (
          <>
            <div className="absolute inset-0 flex items-center justify-between px-2">
              <button
                onClick={handlePrevImage}
                className="bg-gray-200 bg-opacity-50 rounded-full cursor-pointer hover:opacity-100"
              >
                <ChevronLeft className="h-8 w-8 rounded-full hover:bg-gray-300" />
              </button>
              <button
                onClick={handleNextImage}
                className="bg-gray-200 bg-opacity-50 rounded-full cursor-pointer hover:opacity-100"
              >
                <ChevronRight className="h-8 w-8 rounded-full hover:bg-gray-300" />
              </button>
            </div>
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
              {mainImageIndex + 1}/{property.images.length}
            </div>
          </>
        )}
      </div>

      {/* Content Section - Full width on mobile, 58% on desktop */}
      <div className="w-full md:w-[58%] p-4 relative flex flex-col justify-between">
        <div>
          <div className="flex items-center mb-2">
            <span className="text-md md:text-xl font-semibold mr-2">
              AED {property.price}
            </span>
          </div>

        {/* Status indicator */}
{property.status === "Published" ? (
  <div className="absolute top-2 right-2 text-green-800 text-xs font-semibold px-3 py-1 rounded-full bg-green-200 shadow-md">
    <div className="flex items-center space-x-1">
      <div className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></div>
      <span>PUBLISHED</span>
    </div>
  </div>
) : (
  <div className="absolute top-2 right-2 text-red-800 text-xs font-semibold px-3 py-1 rounded-full bg-red-200 shadow-md">
    <div className="flex items-center space-x-1">
      <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
      <span>POCKETED</span>
    </div>
  </div>
)}

          <div className="text-left">
            {/* Property details with responsive wrapping */}
            <div className="flex flex-wrap items-center text-sm text-gray-600 mb-2">
              <span className="mr-3 mb-1">{property.unitType}</span>

              {!property.unitType.toLowerCase().includes("residen") && (
                <>
                  {property.bedrooms && (
                    <span className="mr-3 mb-1 flex items-center">
                      <span className="flex items-center">
                        {property.bedrooms == 0 ? (
                          <>
                            <BedSingle className="w-5 h-5 mr-1" />
                            Studio
                          </>
                        ) : (
                          <>
                            <BedDouble className="w-5 h-5 mr-1" />
                            {property.bedrooms} Bedroom
                            {property.bedrooms > 1 ? "s" : ""}
                          </>
                        )}
                      </span>
                    </span>
                  )}
                  {property.bathrooms && (
                    <span className="mr-3 mb-1 flex items-center">
                      <Bath className="w-5 h-5 mr-1" />
                      {property.bathrooms} Bathrooms
                    </span>
                  )}
                </>
              )}
              <span className="mb-1">Area: {property.size} sqft</span>
            </div>
            <p className="text-md text-[#1c783f] mb-2">{property.title}</p>
            <p className="text-md text-gray-800 mb-2">
              Status: {property.projectStatus ? property.projectStatus : "N/A"}
            </p>
            <p className="text-sm text-gray-700 mb-2">
              <div className="flex items-center text-sm text-red-500">
             <MapPin size={15} className="mr-1.5 flex-shrink-0" />
            <span>PF: {property.locationPf || 'N/A'}</span>
               </div>
              
            <div className="flex items-center text-sm text-green-600 font-medium">
           <MapPin size={15} className="mr-1.5 flex-shrink-0" />
           <span>Bayut: {property.locationBayut || 'N/A'}</span>
            </div>
            </p>
            {/* Date since listing was added */}
            <p className="text-sm text-gray-600 mb-2">
              Listed: {formatTimeSinceAdded(property.createdAt)}
            </p>
            {/* Date since listing was updated */}
            <p className="text-sm text-gray-600 mb-2">
              Updated: {formatTimeSinceAdded(property.updatedAt)}
            </p>
            <div className="mt-4 flex items-center gap-2">
              <div onClick={(e) => e.stopPropagation()}>
                <PropertyBrochureGenerator listing={property} />
              </div>
            </div>
          </div>
        </div>

        {/* Contact and owner info */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-4 gap-3">
          <div>
            <div className="flex items-center">
              <div className="text-sm">Listing Owner: &nbsp;</div>

              <a
                href={property.ownerUrl}
                target="_blank"

                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-sm font-semibold text-[#1c783f] underline"
              >
                {property.ownerName}
              </a>
            </div>
          </div>

         <div className="flex space-x-2">
  <a
    href={`tel:${property.ownerPhone}`}
    onClick={(e) => e.stopPropagation()}
    className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm flex items-center shadow-md hover:bg-blue-600 transition-colors transform hover:scale-105"
  >
    <Phone className="h-4 w-4 mr-2" />
    <span>Call</span>
  </a>
  <a
    href={`https://wa.me/${property.ownerPhone}`}
    onClick={(e) => e.stopPropagation()}
    className="bg-green-500 text-white px-4 py-2 rounded-full text-sm flex items-center shadow-md hover:bg-green-600 transition-colors transform hover:scale-105"
  >
    <MessageCircle className="h-4 w-4 mr-2" />
    <span>Whatsapp</span>
  </a>
</div>


        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
