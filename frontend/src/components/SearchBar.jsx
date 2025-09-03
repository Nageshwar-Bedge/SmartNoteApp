import React from "react";

const SearchBar = ({ searchTerm, setSearchTerm, theme }) => (
  <div className="relative mb-8">
    <label className="relative w-full">
      <input
        type="text"
        value={searchTerm}
        placeholder="Search notes..."
        onChange={(e) => setSearchTerm(e.target.value)}
        autoComplete="off"
        className={`w-full p-3 pl-10 border rounded-lg shadow focus:ring-2 focus:outline-none ${
          theme === "light"
            ? "focus:ring-indigo-400 border-gray-300 bg-white text-gray-900 placeholder-gray-400"
            : "focus:ring-indigo-400 border-gray-600 bg-gray-900 text-gray-100 placeholder-gray-500"
        }`}
        aria-label="Search notes"
      />
      <span
        className={`absolute left-3 top-3 pointer-events-none ${
          theme === "light" ? "text-gray-400" : "text-gray-500"
        }`}
        aria-hidden="true"
      >
        🔍
      </span>
    </label>
  </div>
);

export default SearchBar;
