'use client';

import { useState } from 'react';
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    
    // Debounced search - search as user types with delay
    const timeoutId = setTimeout(() => {
      onSearch(newQuery);
    }, 500);

    // Clear previous timeout
    return () => clearTimeout(timeoutId);
  };

  return (
    <div className="mb-8 flex justify-center">
      <form onSubmit={handleSubmit} className="relative w-full max-w-2xl">
        <input
          type="text"
          placeholder="search here"
          value={query}
          onChange={handleChange}
          className="w-full bg-gray-950 border border-gray-600 rounded-lg px-4 py-3 pl-12 text-white placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors"
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      </form>
    </div>
  );
}
