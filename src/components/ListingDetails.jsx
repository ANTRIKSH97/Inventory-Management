import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  BedDouble,
  BedSingle,
  Bath,
  Phone,
  MessageCircle,
} from "lucide-react";
import PropertyBrochureGenerator from "./PropertyBrochureGenerator";

const ListingDetails = () => {
  const { id } = useParams(); // Get the listing ID from the URL
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Image gallery state and helpers must be declared before any early returns
  const [imageIndex, setImageIndex] = useState(0);
  const images = Array.isArray(property?.images) ? property.images : [];
  const hasImages = images.length > 0 && images[imageIndex]?.url;

  const handlePrev = () => {
    setImageIndex((prev) =>
      prev === 0 ? Math.max(images.length - 1, 0) : prev - 1
    );
  };

  const handleNext = () => {
    setImageIndex((prev) =>
      prev === Math.max(images.length - 1, 0) ? 0 : prev + 1
    );
  };

  const formatTimeSince = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_APP_IMZA_INVENTORY_SINGLE_API}${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch listing details");
        }

        const data = await response.json();
        // Assuming the API returns the property data directly or in a 'data' field
        setProperty(data.data || data);
      } catch (err) {
        setError(err.message);
        toast.error("Error fetching listing details");
        console.error("Error fetching listing details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading listing details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center text-center px-4">
        <div>
          <h1 className="text-2xl font-semibold text-red-600">Error</h1>
          <p className="text-gray-600 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="h-screen flex items-center justify-center text-center px-4">
        <div>
          <h1 className="text-2xl font-semibold text-red-600">Not Found</h1>
          <p className="text-gray-600 mt-2">No listing found for ID: {id}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="mb-4">
        <Link
          to="/"
          className="inline-flex items-center text-[#1c783f] hover:underline"
        >
          <ChevronLeft className="h-5 w-5 mr-1" /> Back to Listings
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="relative w-full h-64 md:h-96 bg-gray-100">
            {hasImages ? (
              <img
                src={images[imageIndex].url}
                alt={property.title || "Property Image"}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                No image available
              </div>
            )}
            {images.length > 1 && (
              <div className="absolute inset-0 flex items-center justify-between px-2">
                <button
                  onClick={handlePrev}
                  className="bg-gray-200 bg-opacity-60 rounded-full hover:bg-opacity-90"
                >
                  <ChevronLeft className="h-8 w-8" />
                </button>
                <button
                  onClick={handleNext}
                  className="bg-gray-200 bg-opacity-60 rounded-full hover:bg-opacity-90"
                >
                  <ChevronRight className="h-8 w-8" />
                </button>
              </div>
            )}
            {images.length > 0 && (
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                {imageIndex + 1}/{images.length}
              </div>
            )}
          </div>

          <div className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <h1 className="text-xl md:text-2xl font-semibold text-[#1c783f]">
                {property.title || "Untitled Property"}
              </h1>
              <div className="text-lg md:text-xl font-semibold">
                AED {property.price || "N/A"}
              </div>
            </div>

            <div className="mt-2 flex flex-wrap gap-2">
              {property.offeringType && (
                <span className="px-2 py-1 text-xs rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  {property.offeringType}
                </span>
              )}
              {property.status && (
                <span className="px-2 py-1 text-xs rounded-full bg-green-50 text-green-700 border border-green-200">
                  {property.status}
                </span>
              )}
              {property.projectStatus && (
                <span className="px-2 py-1 text-xs rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                  {property.projectStatus}
                </span>
              )}
            </div>

            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="rounded-lg border border-gray-100 bg-gray-50 p-3 text-sm">
                <div className="text-gray-500">Area</div>
                <div className="font-semibold">
                  {property.size ?? "N/A"} sqft
                </div>
              </div>
              <div className="rounded-lg border border-gray-100 bg-gray-50 p-3 text-sm">
                <div className="text-gray-500">Bedrooms</div>
                <div className="font-semibold">
                  {property.bedrooms ?? "N/A"}
                </div>
              </div>
              <div className="rounded-lg border border-gray-100 bg-gray-50 p-3 text-sm">
                <div className="text-gray-500">Bathrooms</div>
                <div className="font-semibold">
                  {property.bathrooms ?? "N/A"}
                </div>
              </div>
              <div className="rounded-lg border border-gray-100 bg-gray-50 p-3 text-sm">
                <div className="text-gray-500">Type</div>
                <div className="font-semibold">
                  {property.unitType || "N/A"}
                </div>
              </div>
            </div>

            <div className="mt-6 text-gray-700">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5" />
                <div>
                  <div>PF: {property.locationPf || "N/A"}</div>
                  <div>Bayut: {property.locationBayut || "N/A"}</div>
                </div>
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-600">
              <div>Listed: {formatTimeSince(property.createdAt)}</div>
              <div>Updated: {formatTimeSince(property.updatedAt)}</div>
              {property.id && (
                <div className="text-xs text-gray-500">
                  Listing ID: {property.id}
                </div>
              )}
            </div>
          </div>
        </div>

        <aside className="md:col-span-1 space-y-4">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-sm mb-3">
              <span className="text-gray-600">Listing Owner: </span>
              {property.ownerUrl ? (
                <a
                  className="text-[#1c783f] underline"
                  href={property.ownerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {property.ownerName || property.ownerUrl}
                </a>
              ) : (
                <span>{property.ownerName || "N/A"}</span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              {property.ownerPhone && (
                <a
                  href={`tel:${property.ownerPhone}`}
                  className="w-full text-center bg-gray-100 text-gray-700 px-3 py-2 rounded-md text-sm inline-flex items-center justify-center hover:bg-gray-200 transition"
                >
                  Call <Phone className="h-4 w-4 ml-2 text-blue-600" />
                </a>
              )}
              {property.ownerPhone && (
                <a
                  href={`https://wa.me/${property.ownerPhone}`}
                  className="w-full text-center bg-gray-100 text-gray-700 px-3 py-2 rounded-md text-sm inline-flex items-center justify-center hover:bg-gray-200 transition"
                >
                  Whatsapp{" "}
                  <MessageCircle className="h-4 w-4 ml-2 text-green-900" />
                </a>
              )}
              <div className="pt-1">
                <PropertyBrochureGenerator listing={property} />
              </div>
            </div>
          </div>
        </aside>
      </div>

      <Toaster />
    </div>
  );
};

export default ListingDetails;
