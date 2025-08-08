import React, { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";

const SearchBar = ({ onSearch, onFilterChange, filters = [] }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");

  const handleSearch = (value) => {
    setSearchTerm(value);
    onSearch(value);
  };

  const handleFilterChange = (value) => {
    setSelectedFilter(value);
    onFilterChange(value);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <ApperIcon 
          name="Search" 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" 
        />
        <Input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10"
        />
      </div>
      {filters.length > 0 && (
        <div className="sm:w-48">
          <Select
            value={selectedFilter}
            onChange={(e) => handleFilterChange(e.target.value)}
          >
            <option value="">All</option>
            {filters.map((filter) => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </Select>
        </div>
      )}
    </div>
  );
};

export default SearchBar;