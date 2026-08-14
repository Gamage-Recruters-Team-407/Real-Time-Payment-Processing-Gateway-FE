import { useState } from "react";
import { Search, Calendar } from "lucide-react";

const RefundFilters = ({ onSearch, onFilterChange, onDateChange }) => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [date, setDate] = useState("");

  const filters = ["All", "Approved", "Rejected"];

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    onSearch?.(e.target.value);
  };

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
    onFilterChange?.(filter);
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
    onDateChange?.(e.target.value);
  };

  return (
    <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
      {/* Search */}
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 w-full max-w-xs">
        <Search className="w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search merchant, ID, or customer..."
          className="bg-transparent text-sm outline-none w-full placeholder:text-gray-400"
        />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => handleFilterClick(filter)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
              activeFilter === filter
                ? "bg-gray-900 text-white"
                : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50"
            }`}
          >
            {filter}
          </button>
        ))}

        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-3 py-1.5">
          <Calendar className="w-3.5 h-3.5 text-gray-400" />
          <input
            type="date"
            value={date}
            onChange={handleDateChange}
            className="bg-transparent text-xs text-gray-500 outline-none"
          />
        </div>
      </div>
    </div>
  );
};

export default RefundFilters;