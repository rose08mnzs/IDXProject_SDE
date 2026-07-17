import React from "react";
import { useNavigate } from "react-router-dom";
import PropertyImageCarousel from "./PropertyImageCarousel";
import "../styles/PropertyCard.css";
import { useFavorites } from "../hooks/useFavorites";

export default function PropertyCard({ property }) {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();

  const price =
    property.L_SystemPrice !== null && property.L_SystemPrice !== undefined
      ? `$${Number(property.L_SystemPrice).toLocaleString()}`
      : "Price unavailable";

  const beds = property.L_Keyword2 ?? "—";
  const baths = property.LM_Dec_3 ?? "—";
  const sqft = property.LM_Int2_3 ?? "—";
  const favorite = isFavorite(property);

  const handleClick = () => {
    navigate(`/property/${property.L_ListingID}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      navigate(`/property/${property.L_ListingID}`);
    }
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    toggleFavorite(property);
  };
  return (
    <div
      className="property-card"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      
      <div className="property-image-wrap">
        <button
          type="button"
          className={`favorite-button ${favorite ? "active" : ""}`}
          onClick={handleFavoriteClick}
          aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
          title={favorite ? "Remove from favorites" : "Add to favorites"}
        >
          {favorite ? "♥" : "♡"}
        </button>
        <PropertyImageCarousel
          photosRaw={property.L_Photos}
          altText={property.L_Address || "Property"}
        />
      </div>

      <div className="property-content">
        <div className="address">{property.L_Address || "Address unavailable"}</div>

        <div className="location">
          <span className="icon">📍</span>
          <span className="text">
            {[property.L_City, property.L_State].filter(Boolean).join(", ")}
          </span>
        </div>

        <div className="details">
          <div className="detail-item">
            <span className="icon">🛏</span>
            <span>{beds} beds</span>
          </div>
          <div className="detail-item">
            <span className="icon">🛁</span>
            <span>{baths} baths</span>
          </div>
          <div className="detail-item">
            <span className="icon">📐</span>
            <span>{sqft} sqft</span>
          </div>
        </div>

        <div className="price">{price}</div>
      </div>
    </div>
  );
}