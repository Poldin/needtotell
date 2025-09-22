'use client';

import { Inter } from "next/font/google";
import ScrollToTop from "./components/ScrollToTop";
import SearchBar from "./components/SearchBar";
import PostsList from "./components/PostsList";
import SidebarMenu from "./components/HamburgerMenu";
import { useState, useEffect } from 'react';

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "400", "700"],
});

function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [initialQuery, setInitialQuery] = useState('');

  useEffect(() => {
    // Controlla i parametri URL per il sharing_code
    const urlParams = new URLSearchParams(window.location.search);
    const sharingCode = urlParams.get('src');
    
    if (sharingCode) {
      setInitialQuery(sharingCode);
      setSearchQuery(sharingCode);
    }
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className={`min-h-screen bg-black text-white ${inter.className}`}>
      <ScrollToTop />
      {/* Fixed Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between px-4 py-4 md:px-8">
          {/* Left side - Logo */}
          <div className="text-white font-bold">
            Need to tell
          </div>
          
          {/* Right side - Sidebar menu */}
          <div>
            <SidebarMenu />
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="pt-20 px-4 md:px-8">
        <SearchBar onSearch={handleSearch} initialQuery={initialQuery} />
        <PostsList searchQuery={searchQuery} />
      </div>
    </div>
  );
}

export default HomePage;
