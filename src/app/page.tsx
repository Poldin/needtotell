'use client';

import Link from "next/link";
import { Inter } from "next/font/google";
import { Plus } from "lucide-react";
import ScrollToTop from "./components/ScrollToTop";
import SearchBar from "./components/SearchBar";
import PostsList from "./components/PostsList";
import { useState } from 'react';

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "400", "700"],
});

function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');

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
          
          {/* Right side - Navigation buttons */}
          <div className="flex gap-4">
            <Link 
              href="/new" 
              className="bg-gray-950 hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition-colors font-medium border border-gray-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New
            </Link>
            <Link 
              href="/why" 
              className="bg-gray-950 hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition-colors font-medium border border-gray-700"
            >
              Why
            </Link>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="pt-20 px-4 md:px-8">
        <SearchBar onSearch={handleSearch} />
        <PostsList searchQuery={searchQuery} />
      </div>
    </div>
  );
}

export default HomePage;
