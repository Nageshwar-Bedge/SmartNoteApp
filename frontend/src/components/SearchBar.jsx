import React from "react";

const SearchBar = ({ searchTerm, setSearchTerm, setDateFilter }) => {
  return (
    <div className="flex gap-4 mb-8">
      <div className="relative flex-1">
        <input
          type="text"
          value={searchTerm}
          placeholder="Search notes..."
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 pl-10 border rounded-lg shadow focus:ring-2 focus:ring-blue-500"
        />
        <span className="absolute left-3 top-3 text-gray-400">🔍</span>
      </div>

      <input
        type="date"
        onChange={(e) => setDateFilter(e.target.value)}
        className="p-3 border rounded-lg shadow focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export default SearchBar;
