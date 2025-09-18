import { useEffect, useState } from "react";
import "./App.css";
import Listing from "./Listing";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ListingDetails from "./components/ListingDetails";
import Navbar from "./components/Navbar";
import { ArrowUp } from "lucide-react"; 

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
  
  // Step 2: Naya state button ko dikhane/chhipane ke liye
  const [showScrollTopButton, setShowScrollTopButton] = useState(false);

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

  // Step 3: Scroll event ko handle karne ke liye naya useEffect
  useEffect(() => {
    const handleScroll = () => {
      // Agar user 300px se zyada scroll kar chuka hai, to button dikhayein
      if (window.pageYOffset > 1000) {
        setShowScrollTopButton(true);
      } else {
        setShowScrollTopButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup function: Component ke hatne par event listener ko hata dein
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Step 4: Page ko upar scroll karne wala function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };


  if (!checked) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Checking environment...</p>
      </div>
    );
  }

  return (
    <div className="font-sans bg-grey-50 min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-0">
        <Routes>
          <Route path="/" element={<Listing />} />
          <Route path="/:id" element={<ListingDetails />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      
      <Toaster />

      {/* Step 5: Scroll to Top Button */}
      {showScrollTopButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Scroll to top"
        >
          <ArrowUp size={24} />
        </button>
      )}
    </div>
  );
}

export default AppWrapper;
