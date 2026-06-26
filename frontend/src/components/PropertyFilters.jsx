import React, { useEffect, useState,useRef } from "react";
import { getFirstPhotoUrl } from "../utility/photos";
import "../styles/PropertyFilter.css";

const defaultFilters = {
  city: "",
  zipcode: "",
  minPrice: "",
  maxPrice: "",
  beds: "",
  baths: "",
};

const defaultFilterOptions = {
  beds: [],
  baths: [],
};
export default function PropertyFilter({ filters = defaultFilters, filterOptions = defaultFilterOptions, setFilters, onSearch, onClear }) {
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  const handleClear = () => {
    setFilters();
    onClear();
  };

   return (
    <form className="property-filters" onSubmit={handleSubmit}>
      <div className="filters-grid">
        <div className="filter-group">
          <label htmlFor="city">City</label>
          <input
            id="city"
            name="city"
            type="text"
            value={filters.city}
            onChange={handleChange}
            placeholder="Enter City"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="zipcode">ZIP Code</label>
          <input
            id="zipcode"
            name="zipcode"
            type="text"
            value={filters.zipcode}
            onChange={handleChange}
            placeholder="Enter ZIP code"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="minPrice">Min Price</label>
          <input
            id="minPrice"
            name="minPrice"
            type="number"
            value={filters.minPrice}
            onChange={handleChange}
            placeholder="Enter Min Price"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="maxPrice">Max Price</label>
          <input
            id="maxPrice"
            name="maxPrice"
            type="number"
            value={filters.maxPrice}
            onChange={handleChange}
            placeholder="Enter Max Price"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="beds">Beds</label>
          <select id="beds" name="beds" value={filters.beds} onChange={handleChange}>
           <option value="">Any</option>
            {filterOptions.beds.filter((bed) => bed > 0).map((bed) => (
              <option key={bed} value={bed}>
                {bed}+
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="baths">Baths</label>
          <select id="baths" name="baths" value={filters.baths} onChange={handleChange}>
            <option value="">Any</option>
            {filterOptions.baths.filter((baths) => baths > 0).map((bath) => (
              <option key={bath} value={bath}>
                {bath}+
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="filter-actions">
        <button type="submit">Search</button>
        <button type="button" onClick={handleClear}>
          Clear Filters
        </button>
      </div>
    </form>
  );
}