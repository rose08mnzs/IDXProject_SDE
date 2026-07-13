import React from "react";
import { useNavigate } from "react-router-dom";
import PropertyImageCarousel from "./PropertyImageCarousel";
import "../styles/PropertyCard.css";

export default function PropertyCard({ property }) {
  const navigate = useNavigate();

  const price =
    property.L_SystemPrice !== null && property.L_SystemPrice !== undefined
      ? `$${Number(property.L_SystemPrice).toLocaleString()}`
      : "Price unavailable";

  const beds = property.L_Keyword2 ?? "—";
  const baths = property.LM_Dec_3 ?? "—";
  const sqft = property.LM_Int2_3 ?? "—";

  const handleClick = () => {
    navigate(`/property/${property.L_ListingID}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      navigate(`/property/${property.L_ListingID}`);
    }
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