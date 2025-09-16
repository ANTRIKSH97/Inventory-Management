import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  BedDouble,
  Bath,
  Phone,
  MessageCircle,
  Loader, 
  XCircle, 
  FileQuestion,
  SquareKanban
} from "lucide-react";
import PropertyBrochureGenerator from "./PropertyBrochureGenerator";

const formatTimeSince = (dateStr) => {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  const now = new Date();
  const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "Yesterday";
  return `${diffInDays} days ago`;
};

const ListingDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_APP_IMZA_INVENTORY_SINGLE_API}${id}`
        );
        if (!response.ok) throw new Error("Failed to fetch listing details");
        const data = await response.json();
        setProperty(data.data || data);
      } catch (err) {
        setError(err.message);
        toast.error("Error fetching listing details");
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  const images = Array.isArray(property?.images) ? property.images : [];
  const hasImages = images.length > 0 && images[imageIndex]?.url;

  const handlePrev = () =>
    setImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const handleNext = () =>
    setImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  if (loading)
    return (
      <div className="h-screen flex flex-col items-center justify-center text-gray-500">
        <Loader size={48} className="animate-spin mb-4" />
        <p className="text-lg font-semibold">Loading Listing Details...</p>
      </div>
    );

  if (error)
    return (
      <div className="h-screen flex flex-col items-center justify-center text-center px-4">
        <XCircle size={52} className="mx-auto text-red-400 mb-4" />
        <h1 className="text-2xl font-semibold text-red-600">An Error Occurred</h1>
        <p className="text-gray-600 mt-2">{error}</p>
        <Link to="/" className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Go Back to Listings
        </Link>
      </div>
    );

  if (!property)
    return (
      <div className="h-screen flex flex-col items-center justify-center text-center px-4">
        <FileQuestion size={52} className="mx-auto text-gray-400 mb-4" />
        <h1 className="text-2xl font-semibold text-gray-800">Property Not Found</h1>
        <p className="text-gray-600 mt-2">Could not find a listing with ID: {id}</p>
        <Link to="/" className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Go Back to Listings
        </Link>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Toaster />
      <div className="mb-2 flex justify-start">
        <Link
          to="/"
          className="group inline-flex items-center space-x-2 px-4 py-2 rounded-lg border border-green-200 bg-green-50 text-green-600 font-semibold shadow-sm hover:bg-green-100 hover:text-green-800 transition-all duration-300"
        >
          <ChevronLeft className="h-5 w-5 text-green-600 group-hover:-translate-x-1 transition-transform duration-300" />
          Back to Inventory
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Left Column: Image Gallery */}
        <div className="space-y-3">
          <div className="relative w-full h-[420px] bg-gray-100 rounded-xl shadow-lg border border-green-700 overflow-hidden">
            {hasImages ? (
              <img src={images[imageIndex].url} alt={property.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                No image available
              </div>
            )}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-green/70 p-2 rounded-full hover:bg-white transition-all shadow-md"
                >
                  <ChevronLeft />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-green/70 p-2 rounded-full hover:bg-white transition-all shadow-md"
                >
                  <ChevronRight />
                </button>
                <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full">
                  {imageIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setImageIndex(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                    imageIndex === index ? "border-blue-500" : "border-transparent"
                  }`}
                >
                  <img src={image.url} alt={`thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
 <div className="bg-white rounded-xl shadow-lg border border-green-700 p-4 flex flex-col">
          <div className="flex-grow">
            <p className="text-2xl font-bold text-green-700 mt-">AED {property.price}</p>
            <h1 className="text-2xl font-bold text-black">{property.title}</h1> 
            
            <div className="mt-4 flex flex-wrap gap-2">
  {[property.offeringType, property.status, property.projectStatus].map(
    (tag) =>
      tag && (
        <span
          key={tag}
          className="px-3 py-1 text-xs font-semibold rounded-full 
                     bg-gradient-to-r from-green-400 via-green-500 to-green-600 
                     text-white shadow-md 
                     hover:scale-105 transition-transform duration-200 cursor-default"
        >
          {tag}
        </span>
      )
  )}
</div>


            <div className="border-t border-gray-200 my-6"></div>

            {/* Left-to-Right Details */}
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center text-black-700">
                <BedDouble size={16} className="mr-2 text-amber-400" />
                <span>{property.bedrooms ?? "N/A"} Bedrooms</span>
              </div>
              <div className="flex items-center text-black-700">
                <Bath size={16} className="mr-2 text-red-400" />
                <span>{property.bathrooms ?? "N/A"} Bathrooms</span>
              </div>
              <div className="flex items-center text-black-700">
                <SquareKanban size={16} className="mr-2 text-green-400" />
                <span>{property.size ?? "N/A"} sqft</span>
              </div>
              <div className="flex items-center text-black-700">
                
              </div>
              <div className="flex items-center text-green-800">
                <MapPin size={16} className="mr-2 text-green-900" />
                <span>{property.locationPf || "N/A"}</span>
              </div>
            </div>

            <div className="text-xs text-gray-600 mt-4 flex flex-wrap gap-4">
              {property.reference && <p>Ref ID: {property.reference}</p>}
            </div>
          </div>

          <div className="border-t border-gray-200 mt-6 pt-6 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="text-gray-600 text-sm">Listing Owner:</span>
              <a
                href={property.ownerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 font-semibold hover:underline"
              >
                {property.ownerName || "N/A"}
              </a>
            </div>

            <div className="flex flex-wrap gap-4">
              <a
                href={`tel:${property.ownerPhone}`}
                className="flex-1 flex items-center justify-center bg-blue-600 text-white px- py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                <Phone size={16} className="mr-2" /> Call
              </a>
              <a
                href={`https://wa.me/${property.ownerPhone}`}
                className="flex-1 flex items-center justify-center bg-green-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                <MessageCircle size={16} className="mr-2" /> Whatsapp
              </a>
              <div className="flex-1">
                <PropertyBrochureGenerator listing={property} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetails;
