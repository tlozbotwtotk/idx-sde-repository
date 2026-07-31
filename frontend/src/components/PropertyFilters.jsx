import React, { useState } from "react";

function PropertyFilters({ onSearch }) {
  const [filters, setFilters] = useState({
    city: "",
    zipcode: "",
    minPrice: "",
    maxPrice: "",
    beds: "",
    baths: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Remove empty filter values before sending to API
    const cleanFilters = {};

    Object.entries(filters).forEach(([key, value]) => {
      if (value.trim() !== "") {
        cleanFilters[key] = value.trim();
      }
    });

    onSearch(cleanFilters);
  };

  const handleClear = () => {
    const resetFilters = {
      city: "",
      zipcode: "",
      minPrice: "",
      maxPrice: "",
      beds: "",
      baths: "",
    };

    setFilters(resetFilters);

    // Reload all properties
    onSearch({});
  };

  return (
    <form className="property-filters" onSubmit={handleSubmit}>
      <div className="filter-row">

        <div className="filter-group">
          <label>City</label>
          <input
            type="text"
            name="city"
            value={filters.city}
            onChange={handleChange}
            placeholder="Enter city"
          />
        </div>

        <div className="filter-group">
          <label>ZIP Code</label>
          <input
            type="text"
            name="zipcode"
            value={filters.zipcode}
            onChange={handleChange}
            placeholder="Enter ZIP"
          />
        </div>

        <div className="filter-group">
          <label>Min Price</label>
          <input
            type="number"
            name="minPrice"
            value={filters.minPrice}
            onChange={handleChange}
            placeholder="Minimum price"
          />
        </div>

        <div className="filter-group">
          <label>Max Price</label>
          <input
            type="number"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handleChange}
            placeholder="Maximum price"
          />
        </div>

        <div className="filter-group">
          <label>Beds</label>
          <select
            name="beds"
            value={filters.beds}
            onChange={handleChange}
          >
            <option value="">Any</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="5">5+</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Baths</label>
          <select
            name="baths"
            value={filters.baths}
            onChange={handleChange}
          >
            <option value="">Any</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
          </select>
        </div>

      </div>

      <div className="filter-actions">
        <button type="submit">
          Search
        </button>

        <button
          type="button"
          onClick={handleClear}
        >
          Clear Filters
        </button>
      </div>
    </form>
  );
}

export default PropertyFilters;