import React, { useEffect, useState,useRef } from "react";
import { getFirstPhotoUrl } from "../utility/photos";
import { useNavigate } from "react-router-dom";
import "../styles/PropertyFilter.css";
import { useFavorites } from "../hooks/useFavorites";

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

const sortOptions = [
  { value: "", label: "Default" },
  { value: "L_SystemPrice", label: "Price" },
  { value: "ListingContractDate", label: "Date Listed" },
  { value: "LM_Int2_3", label: "Square Footage" },
  { value: "L_Keyword2", label: "Beds" },
];

export default function PropertyFilter({ filters = defaultFilters, 
  filterOptions = defaultFilterOptions, setFilters, onSearch, onClear,
  sortBy = "",
  sortOrder = "asc",
  onSortChange, }) {
 
  const navigate = useNavigate();
  const { favoritesCount } = useFavorites();

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

  const handleSortByChange = (e) => {
    const nextSortBy = e.target.value;
    const nextSortOrder = nextSortBy ? sortOrder : "asc";
    onSortChange?.(nextSortBy, nextSortOrder);
  };

  const handleSortOrderChange = (e) => {
    onSortChange?.(sortBy, e.target.value);
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
        <div className="filter-group">
          <label htmlFor="sortBy">Sort By</label>
          <select id="sortBy" value={sortBy} onChange={handleSortByChange}>
            {sortOptions.map((option) => (
              <option key={option.value || "default"} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="sortOrder">Sort Order</label>
          <select
            id="sortOrder"
            value={sortOrder}
            onChange={handleSortOrderChange}
            disabled={!sortBy}
          >
            <option value="asc">Low to High</option>
            <option value="desc">High to Low</option>
          </select>
        </div>
      </div>

      <div className="filter-actions">
        <div className="filter-buttons">
          <button type="submit">Search</button>
          <button type="button" onClick={handleClear}>
            Clear Filters
          </button>
        </div>
            <div className="filter-buttons">
        <button
          type="button"
          onClick={() => navigate("/favorites")}
        >
          ❤️ Saved Homes ({favoritesCount})
        </button>
        </div>
      </div>
    </form>
  );
}