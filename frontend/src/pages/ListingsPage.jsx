import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchProperties, fetchFilterOptions } from "../api/client";
import "../styles/ListingsPage.css";
import PropertyCard from "../components/PropertyCard";
import LoadingSpinner from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import PropertyFilters from "../components/PropertyFilters";
import NoResultsMessage from "../components/NoResultsMessage";
import Pagination from "../components/Pagination";
import { useFavorites } from "../hooks/useFavorites";

const initialFilters = {
  city: "",
  zipcode: "",
  minPrice: "",
  maxPrice: "",
  beds: "",
  baths: "",
};

const initialSort = {
  sortBy: "",
  sortOrder: "asc",
};

function getFiltersFromParams(searchParams) {
  return {
    city: searchParams.get("city") || "",
    zipcode: searchParams.get("zipcode") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    beds: searchParams.get("beds") || "",
    baths: searchParams.get("baths") || "",
  };
}
function getSortFromParams(searchParams) {
  return {
    sortBy: searchParams.get("sortBy") || "",
    sortOrder: searchParams.get("sortOrder") || "asc",
  };
}


export default function ListingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { favoritesCount } = useFavorites();

  const [properties, setProperties] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState(() => getFiltersFromParams(searchParams));
  const [filterOptions, setFilterOptions] = useState({
    beds: [],
    baths: [],
  });
  const [currentPage, setCurrentPage] = useState(
    () => Number(searchParams.get("page") || 1)
  );
  const [itemsPerPage] = useState(20);
  const requestIdRef = useRef(0);

  const [sortBy, setSortBy] = useState(() => getSortFromParams(searchParams).sortBy);
  const [sortOrder, setSortOrder] = useState(() => getSortFromParams(searchParams).sortOrder);

  const loadProperties = async (activeFilters = filters, page = currentPage,
    activeSortBy = sortBy,
    activeSortOrder = sortOrder
  ) => {
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
      const queryParams = {
        limit: itemsPerPage,
        offset,
        ...cleanedFilters,
      };

      if (activeSortBy) {
        queryParams.sortBy = activeSortBy;
        queryParams.sortOrder = activeSortOrder || "asc";
      }
      const data = await fetchProperties(queryParams);

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

  useEffect(() => {
    loadDropdowns();
  }, []);

  useEffect(() => {
    const nextFilters = getFiltersFromParams(searchParams);
    const nextSort = getSortFromParams(searchParams);
    const nextPage = Number(searchParams.get("page") || 1);

    setFilters(nextFilters);
    setSortBy(nextSort.sortBy);
    setSortOrder(nextSort.sortOrder);
    setCurrentPage(nextPage);
    loadProperties(nextFilters, nextPage, nextSort.sortBy, nextSort.sortOrder);
  
  }, [searchParams]);

  const loadDropdowns = async () => {
    try {
      const initialDropDownData = await fetchFilterOptions();
      setFilterOptions({
        beds: initialDropDownData.beds || [],
        baths: initialDropDownData.baths || [],
      });
    } catch (err) {
      setError(err.message || "Failed to load dropdown options.");
    }
  };

  function buildParams(nextFilters, page = 1, nextSort = initialSort) {
    const params = new URLSearchParams();

    Object.entries(nextFilters).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        params.set(key, value);
      }
    });

    if (nextSort.sortBy) {
      params.set("sortBy", nextSort.sortBy);
      params.set("sortOrder", nextSort.sortOrder || "asc");
    }

    params.set("page", String(page));
    return params;
  }

  const handleSearch = () => {
    setSearchParams(buildParams(filters, 1,initialSort));
  };

  const handleClear = () => {
    setFilters(initialFilters);
    setSortBy("");
    setSortOrder("asc");
    setSearchParams(buildParams(initialFilters, 1, initialSort));
  };

  const handlePageChange = (page) => {
    const params = buildParams(filters, page, { sortBy, sortOrder });
    setSearchParams(params);
    window.scrollTo(0, 0);
  };
  const handleSortChange = (nextSortBy, nextSortOrder) => {
      setSortBy(nextSortBy);
      setSortOrder(nextSortOrder || "asc");
      setSearchParams(
        buildParams(filters, 1, {
          sortBy: nextSortBy,
          sortOrder: nextSortOrder || "asc",
        })
      );
    };
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

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
          filterOptions={filterOptions}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
        />
      </div>

      <div className="listings-subpage">
        {properties.length === 0 && (
          <NoResultsMessage title="No Properties Found" message="Try different filters." />
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