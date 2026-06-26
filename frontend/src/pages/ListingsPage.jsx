import React, { useEffect, useState, useRef } from "react";
import { fetchProperties, fetchFilterOptions } from "../api/client";
import "../styles/ListingsPage.css";
import PropertyCard from "../components/PropertyCard";
import LoadingSpinner from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import PropertyFilters from "../components/PropertyFilters";
import NoResultsMessage from "../components/NoResultsMessage";

const initialFilters = {
  city: "",
  zipcode: "",
  minPrice: "",
  maxPrice: "",
  beds: "",
  baths: "",
};

export default function ListingsPage() {
  const [properties, setProperties] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState(initialFilters);
  const [filterOptions, setFilterOptions] = useState({
    beds: [],
    baths: [],
  });
  const requestIdRef = useRef(0);

  const loadProperties = async (activeFilters = filters) => {
    const requestId = ++requestIdRef.current;
    try {
      setLoading(true);
      setError("");

      const cleanedFilters = Object.fromEntries(
        Object.entries(activeFilters).filter(
          ([, value]) => value !== "" && value !== null && value !== undefined
        )
      );
      const data = await fetchProperties({ limit: 20, offset: 0, ...cleanedFilters });
      if (requestId !== requestIdRef.current) return;

      const results = data.results || [];
      setProperties(results);
      setTotal(typeof data.total === "number" ? data.total : results.length);
    } catch (err) {
      if (requestId !== requestIdRef.current) return;
      setError(err.message || "Failed to load properties.");
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  };
  const loadDropdowns = async () => {
    try {
      setLoading(true);
      setError("");
      const initialDropDownData = await fetchFilterOptions();
      console.log("Initial Drop Down Data:", initialDropDownData);
      setFilterOptions({
        beds: initialDropDownData.beds || [],
        baths: initialDropDownData.baths || [],
      });
    } catch (err) {
      setError(err.message || "Failed to load dropdown options.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadDropdowns();
    loadProperties(initialFilters);
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }
  const handleSearch = () => {
    loadProperties(filters);
  };

  const handleClear = () => {
    setFilters(initialFilters);
    loadProperties(initialFilters);
  };

  return (
    <>
      <div className="listings-page">
        <header className="hero-banner">
          <div className="hero-overlay">
            <h1>Property Listings</h1>
            <p className="hero-count">
              Showing {properties.length} of {total.toLocaleString()} properties
            </p>
          </div>
        </header>
        <PropertyFilters
          filters={filters}
          setFilters={setFilters}
          onSearch={handleSearch}
          onClear={handleClear}
          filterOptions={filterOptions} />
      </div>
      <div className="listings-subpage">
        {properties.length === 0 && (
          <NoResultsMessage
            title="No Properties Found"
            message="Try different filters."
          />
        )}
        {properties.length > 0 && (
          <div className="property-grid">
            {properties.map((property) => (
              <PropertyCard
                key={property.L_ListingID || property.id}
                property={property}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}