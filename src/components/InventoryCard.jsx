import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BedDouble, Bath, SquareKanban, MapPin, Phone, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import PropertyBrochureGenerator from './PropertyBrochureGenerator';

// Helper function
const formatTimeSinceAdded = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now - date;
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "Yesterday";
  return `${diffInDays} days ago`;
};

const InventoryCard = ({ property , view  }) => {
  const navigate = useNavigate();
  const [mainImageIndex, setMainImageIndex] = React.useState(0);

  if (!property) return null;
  const { images = [] } = property;

  const handleNextImage = (e) => {
    e.stopPropagation();
    setMainImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setMainImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleCardClick = () => {
    if (property.id) {
      navigate(`/${property.id}`);
    }
  };

  return (
  <div
    className={`flex flex-col bg-white rounded-xl shadow-lg overflow-hidden 
    transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer 
    border border-green-700 
    ${view === "grid" ? "w-full md:w-[48%]" : "w-full"}`}
    onClick={handleCardClick}
    role="button"
    tabIndex={0}
  >
    {/* === Image Section === */}

      <div className="relative w-full h-50 flex-shrink-0 ">
        {images.length > 0 && images[mainImageIndex]?.url ? (
          <img
            src={images[mainImageIndex].url}
            alt={property.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}

        <div className="absolute top-3 left-3 bg-black/50 text-white text-xs font-bold px-2.5 py-1 rounded-full">
          FOR {property.offeringType?.toUpperCase() || 'N/A'}
        </div>

        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-green/70 p-1.5 rounded-full hover:bg-white transition-all shadow-md"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-green/70 p-1.5 rounded-full hover:bg-white transition-all shadow-md"
            >
              <ChevronRight size={20} />
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full">
              {mainImageIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* === Content Section === */}
      <div className="p-5 flex flex-col justify-between flex-1 text-left">
        <div>
          <div className="flex justify-between items-start">
<p
  className="text-2xl font-bold"
  style={{ color: "#212529" }}
>
  AED {property.price || 'N/A'}
</p>
<span
              className={`px-3 py-1 text-xs font-semibold rounded-full transition-all duration-300  ${
                property.status === 'Published'
                  ? 'bg-green-100 text-green-900 shadow-md ring-2 ring-green-500 animate-pulse-glow'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {property.status || 'N/A'}
            </span>
          </div>

          <h3 className="text-lg font-semibold mt-2 break-words">
            {property.title || 'Untitled Property'}
          </h3>

          <div className="flex flex-wrap gap-3  my-4 text-sm text-black-700">
            <div className="flex items-center">
              <BedDouble size={16} className="mr-1.5 text-black-500" />
              <span>{property.bedrooms ?? 'N/A'} Beds</span>
            </div>
            <div className="flex items-center">
              <Bath size={16} className="mr-1.5 text-black-500" />
              <span>{property.bathrooms ?? 'N/A'} Baths</span>
            </div>
            <div className="flex items-center">
              <SquareKanban size={16} className="mr-1.5 text-black-500" />
              <span>{property.size ?? 'N/A'} sqft</span>
            </div>
          </div>

          {/* --- All Details --- */}
          <div className="space-y-2 text-sm text-black-600 border-t border-gray-100 pt-3">
            <div className="flex items-center font-medium"
              style={{ color: "#004B23" }}>
              <MapPin size={15} className="mr-1.5 flex-shrink-0" />
              <span>Bayut: {property.locationBayut || 'N/A'}</span>
            </div>
            <div className="flex items-center"
            style = {{color: "#8D0801"}}>
              <MapPin size={15} className="mr-1.5 flex-shrink-0" />
              <span>PF: {property.locationPf || 'N/A'}</span>
            </div>
            <p>Status: {property.projectStatus || 'N/A'}</p>
            {/* <p>Listed: {formatTimeSinceAdded(property.createdAt)}</p>
            <p>Updated: {formatTimeSinceAdded(property.updatedAt)}</p> */}
          </div>
        </div>

       {/* --- Bottom Section (Re-ordered) --- */}
        <div className="mt-4 pt-4 border-t">
            <div className="space-y-3">
                {/* 1. Owner Name (Sabse Upar) */}
                <div className="text-sm">
                  <span className="text-gray-600 font-medium">Listing Owner: </span>
                  <a
                    href={property.ownerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="font-semibold text-blue-600 hover:underline"
                  >
                    {property.ownerName || 'N/A'}
                  </a>
                </div>

                {/* 2. Call and Whatsapp Buttons */}
                <div className="flex space-x-2">
                  <a
                    href={`tel:${property.ownerPhone}`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 text-center bg-blue-500 text-white px-4 py-2 rounded-full text-sm flex items-center justify-center shadow-md hover:bg-blue-600"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    <span>Call</span>
                  </a>
                  <a
                    href={`https://wa.me/${property.ownerPhone}`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 text-center bg-green-500 text-white px-4 py-2 rounded-full text-sm flex items-center justify-center shadow-md hover:bg-green-600"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    <span>Whatsapp</span>
                  </a>
                </div>

                {/* 3. Brochure Generator (Sabse Neeche) */}
                <div onClick={(e) => e.stopPropagation()} className="pt-1">
                  <PropertyBrochureGenerator listing={property} />
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryCard;

