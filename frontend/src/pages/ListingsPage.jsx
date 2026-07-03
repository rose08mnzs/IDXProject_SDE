import React, { useEffect, useState, useRef } from "react";
import { fetchProperties, fetchFilterOptions } from "../api/client";
import "../styles/ListingsPage.css";
import PropertyCard from "../components/PropertyCard";
import LoadingSpinner from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import PropertyFilters from "../components/PropertyFilters";
import NoResultsMessage from "../components/NoResultsMessage";
import Pagination from "../components/Pagination";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const requestIdRef = useRef(0);

  const loadProperties = async (activeFilters = filters, page = currentPage) => {
    const requestId = ++requestIdRef.current;
    try {
      setLoading(true);
      setError("");

      const cleanedFilters = Object.fromEntries(
        Object.entries(activeFilters).filter(
          ([, value]) => value !== "" && value !== null && value !== undefined
        )
      );
      const offset = (page - 1) * itemsPerPage;
      const data = await fetchProperties({ limit: itemsPerPage, offset, ...cleanedFilters });
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
    setCurrentPage(1);
    loadProperties(filters, 1);
  };
  const handleClear = () => {
    setFilters(initialFilters);
    setCurrentPage(1);
    loadProperties(initialFilters,1);
  };
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
    loadProperties(filters, page);
  };
  const totalPages = Math.ceil(total / itemsPerPage);
  const startItem = total === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, total);

  return (
    <>
      <div className="listings-page">
        <header className="hero-banner">
          <div className="hero-overlay">
            <h1>Property Listings</h1>
            <p className="hero-count">
              Showing {startItem}-{endItem} of {total.toLocaleString()} properties
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
         {properties.length > 0 && totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalItems={total}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
              />
            )}
      </div>
    </>
  );
}