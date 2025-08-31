import React from "react";

const SearchBar = ({ searchTerm, setSearchTerm }) => (
  <div className="relative mb-8">
    <input
      type="text"
      value={searchTerm}
      placeholder="Search notes..."
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-full p-3 pl-10 border rounded-lg shadow focus:ring-2 focus:ring-indigo-400 bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-600"
    />
    <span className="absolute left-3 top-3 text-gray-400">🔍</span>
  </div>
);

export default SearchBar;
