import { useEffect, useState } from "react";
import "./App.css";
import Listing from "./Listing";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ListingDetails from "./components/ListingDetails";
import Navbar from "./components/Navbar";

function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

function App() {
  const [isBitrix, setIsBitrix] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    try {
      const insideBitrix = window !== window.parent;
      setIsBitrix(insideBitrix);
    } catch {
      setIsBitrix(false);
    } finally {
      setChecked(true);
    }
  }, []);

  if (!checked) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Checking environment...</p>
      </div>
    );
  }

  // if (!isBitrix) {
  //   return (
  //     <div className="h-screen flex items-center justify-center text-center px-4">
  //       <div>
  //         <h1 className="text-2xl font-semibold text-red-600">
  //           Bitrix24 Required
  //         </h1>
  //         <p className="text-gray-600 mt-2">
  //           Unauthorized access. This app must be launched inside the Bitrix24.
  //         </p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
  <div className="font-sans bg-grey-50 min-h-screen">
      {/* Updated Navbar yahan hai */}
      <Navbar />

      {/* Main Content Area se Title HATA diya gaya hai */}
      <main className="max-w-7xl mx-auto px-4 py-0">
        {/* Routing */}
        <Routes>
          <Route path="/" element={<Listing />} />
          <Route path="/:id" element={<ListingDetails />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      
      {/* Toaster for notifications */}
      <Toaster />
    </div>
  );
}

export default AppWrapper;
