'use client';

import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button 
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 bg-gray-950 hover:bg-gray-800 text-white p-3 rounded-full border border-gray-700 transition-all duration-300 z-40 opacity-70 hover:opacity-100"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
}
